import { Component } from '@angular/core';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  public readonly BLOG_CATEGORIES = [
    {
      title: 'VIAJES',
      order: '1',
    },
    {
      title: 'JUEGOS',
      order: '2',
    },
    {
      title: 'PLANES',
      order: '3',
    },
    {
      title: 'PUBLICACIONES',
      order: '4',
    },
    {
      title: 'ARTE',
      order: '5',
    },
    {
      title: 'DISEÑO',
      order: '6',
    },
  ];
}
