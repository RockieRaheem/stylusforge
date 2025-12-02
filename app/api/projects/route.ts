import { NextRequest, NextResponse } from 'next/server';

interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  code: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  deployedAddress?: string;
  network?: string;
  status: 'draft' | 'deployed' | 'failed';
}

// In-memory storage (replace with database in production)
const projects = new Map<string, Project>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');

    if (projectId) {
      const project = projects.get(projectId);
      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(project);
    }

    if (userId) {
      const userProjects = Array.from(projects.values()).filter(
        p => p.userId === userId
      );
      return NextResponse.json(userProjects);
    }

    // Return all projects (for admin/public view)
    return NextResponse.json(Array.from(projects.values()));
  } catch (error) {
    console.error('Project fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, description, code, language } = body;

    if (!userId || !name || !code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const project: Project = {
      id: crypto.randomUUID(),
      userId,
      name,
      description: description || '',
      code,
      language: language || 'rust',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    };

    projects.set(project.id, project);

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, ...updateData } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      );
    }

    const project = projects.get(projectId);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const updatedProject = {
      ...project,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    projects.set(projectId, updatedProject);

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      );
    }

    if (!projects.has(projectId)) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    projects.delete(projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Project deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
