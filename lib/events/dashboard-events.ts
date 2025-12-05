/**
 * Dashboard Events
 * Custom event system for triggering dashboard updates across the app
 */

// Event names
export const DASHBOARD_EVENTS = {
  DEPLOYMENT_SUCCESS: 'dashboard:deployment-success',
  TUTORIAL_COMPLETED: 'dashboard:tutorial-completed',
  PROJECT_CREATED: 'dashboard:project-created',
  PROJECT_UPDATED: 'dashboard:project-updated',
  REFRESH_NEEDED: 'dashboard:refresh-needed',
} as const;

// Event detail types
export interface DeploymentSuccessDetail {
  contractAddress: string;
  transactionHash: string;
  network: string;
}

export interface TutorialCompletedDetail {
  tutorialId: string;
  tutorialTitle: string;
}

export interface ProjectCreatedDetail {
  projectId: string;
  projectName: string;
}

// Emit dashboard event
export function emitDashboardEvent(
  eventName: string,
  detail?: any
) {
  if (typeof window === 'undefined') return;
  
  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
  console.log('📢 Dashboard event emitted:', eventName, detail);
}

// Listen to dashboard event
export function onDashboardEvent(
  eventName: string,
  handler: (event: CustomEvent) => void
) {
  if (typeof window === 'undefined') return () => {};
  
  window.addEventListener(eventName, handler as EventListener);
  
  return () => {
    window.removeEventListener(eventName, handler as EventListener);
  };
}

// Trigger dashboard refresh
export function triggerDashboardRefresh() {
  emitDashboardEvent(DASHBOARD_EVENTS.REFRESH_NEEDED);
}

// Notify deployment success
export function notifyDeploymentSuccess(detail: DeploymentSuccessDetail) {
  emitDashboardEvent(DASHBOARD_EVENTS.DEPLOYMENT_SUCCESS, detail);
  triggerDashboardRefresh();
}

// Notify tutorial completion
export function notifyTutorialCompleted(detail: TutorialCompletedDetail) {
  emitDashboardEvent(DASHBOARD_EVENTS.TUTORIAL_COMPLETED, detail);
  triggerDashboardRefresh();
}

// Notify project creation
export function notifyProjectCreated(detail: ProjectCreatedDetail) {
  emitDashboardEvent(DASHBOARD_EVENTS.PROJECT_CREATED, detail);
  triggerDashboardRefresh();
}
