import { NextRequest, NextResponse } from 'next/server';
import { StylusCompiler } from '@/lib/compiler/stylus';

export async function POST(request: NextRequest) {
  try {
    const { code, language, projectName } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    // Only support Rust for now
    if (language !== 'rust') {
      return NextResponse.json(
        { error: 'Only Rust compilation is supported' },
        { status: 400 }
      );
    }

    // Check if cargo-stylus is installed
    const isInstalled = await StylusCompiler.isInstalled();
    
    // If cargo-stylus is not installed, use mock compilation for development
    if (!isInstalled) {
      console.warn('⚠️  cargo-stylus not installed, using mock compilation');
      
      // Mock compilation result for development
      const mockBytecode = '0x' + Buffer.from(code.slice(0, 100)).toString('hex');
      
      return NextResponse.json({
        success: true,
        bytecode: mockBytecode,
        abi: JSON.stringify([
          {
            type: 'function',
            name: 'get_count',
            inputs: [],
            outputs: [{ name: '', type: 'uint256' }],
          },
        ]),
        wasmSize: 1024,
        warnings: ['⚠️  Using mock compilation - cargo-stylus not installed'],
        gasEstimate: '50000',
        mockMode: true,
      });
    }

    // Compile the Rust code with real cargo-stylus
    const result = await StylusCompiler.compile(code, projectName || 'contract');

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.errors,
          warnings: result.warnings,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      bytecode: result.bytecode,
      abi: result.abi,
      wasmSize: result.wasmSize,
      warnings: result.warnings,
      gasEstimate: result.gasEstimate,
    });

  } catch (error: any) {
    console.error('Compilation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Compilation failed',
      },
      { status: 500 }
    );
  }
}

// Syntax validation endpoint
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'check-installation') {
      const isInstalled = await StylusCompiler.isInstalled();
      const version = await StylusCompiler.getVersion();

      return NextResponse.json({
        installed: isInstalled,
        version,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
