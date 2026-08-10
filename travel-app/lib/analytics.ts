/**
 * Analytics stubs for the Itinerate app.
 * Replace implementations with your actual analytics provider.
 *
 * Auth events per docs/02-app-flows-and-workspaces/10 - Authentication Flow.md
 * Home events per docs/02-app-flows-and-workspaces/11 - Home Discovery Flow.md
 */

type AuthEvent =
  | 'auth_started'
  | 'otp_sent'
  | 'otp_verified'
  | 'otp_failed'
  | 'permission_granted'
  | 'permission_denied'
  | 'auth_completed'
  | 'auth_abandoned';

type HomeEvent =
  | 'home_opened'
  | 'widget_clicked'
  | 'recommendation_opened'
  | 'destination_viewed'
  | 'search_started'
  | 'plan_saved'
  | 'plan_shared'
  | 'create_started'
  | 'scroll_depth'
  | 'refresh_triggered'
  | 'widget_reordered';

type SearchEvent =
  | 'search_started'
  | 'search_completed'
  | 'suggestion_selected'
  | 'voice_search_used'
  | 'ai_search_used'
  | 'filter_applied'
  | 'history_cleared'
  | 'search_abandoned'
  | 'search_converted';

export function trackAuthEvent(
  event: AuthEvent,
  params?: Record<string, string | number | boolean>,
): void {
  if (__DEV__) {
    console.log(`[Analytics:Auth] ${event}`, params ?? '');
  }
  // TODO: integrate with your analytics provider (e.g. Firebase, Mixpanel)
}

export function trackHomeEvent(
  event: HomeEvent,
  params?: Record<string, string | number | boolean>,
): void {
  if (__DEV__) {
    console.log(`[Analytics:Home] ${event}`, params ?? '');
  }
  // TODO: integrate with your analytics provider (e.g. Firebase, Mixpanel)
}

export function trackSearchEvent(
  event: SearchEvent,
  params?: Record<string, string | number | boolean>,
): void {
  if (__DEV__) {
    console.log(`[Analytics:Search] ${event}`, params ?? '');
  }
  // TODO: integrate with your analytics provider (e.g. Firebase, Mixpanel)
}

type ExploreEvent =
  | 'explore_opened'
  | 'marker_viewed'
  | 'marker_selected'
  | 'map_panned'
  | 'map_zoomed'
  | 'card_opened'
  | 'nearby_used'
  | 'hidden_gems_used'
  | 'download_region'
  | 'navigation_started'
  | 'ai_recommendation_clicked'
  | 'compare_opened'
  | 'route_previewed'
  | 'mode_switched';

export function trackExploreEvent(
  event: ExploreEvent,
  params?: Record<string, string | number | boolean>,
): void {
  if (__DEV__) {
    console.log(`[Analytics:Explore] ${event}`, params ?? '');
  }
  // TODO: integrate with your analytics provider (e.g. Firebase, Mixpanel)
}
