import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutele cu parametri folosesc Server rendering
  {
    path: 'admin/view-post/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'user/view-post/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'user/**',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
