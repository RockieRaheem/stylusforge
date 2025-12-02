import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, network } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code required' },
        { status: 400 }
      );
    }

    // Calculate gas estimate based on code complexity
    const codeLength = code.length;
    const complexityScore = (code.match(/fn|struct|impl|let|match/g) || []).length;
    
    // Base gas + complexity factor
    const baseGas = 21000;
    const deploymentGas = codeLength * 10;
    const complexityGas = complexityScore * 500;
    
    const totalGas = baseGas + deploymentGas + complexityGas;

    // Stylus contracts are significantly cheaper
    const stylusMultiplier = 0.01; // 99% cheaper
    const estimatedGas = Math.floor(totalGas * stylusMultiplier);

    return NextResponse.json({
      gasEstimate: estimatedGas.toString(),
      gasEstimateGwei: (estimatedGas / 1e9).toFixed(4),
      comparisonSolidity: totalGas.toString(),
      savings: Math.floor((1 - stylusMultiplier) * 100) + '%',
    });
  } catch (error) {
    console.error('Gas estimation error:', error);
    return NextResponse.json(
      { error: 'Gas estimation failed' },
      { status: 500 }
    );
  }
}
