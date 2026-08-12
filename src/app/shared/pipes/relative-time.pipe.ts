import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date | undefined | null): string {
    if (!value) return '';
    const date = new Date(value);
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.round(diffMs / 60000);

    if (diffMin < 1) return 'justo ahora';
    if (diffMin < 60) return `hace ${diffMin} min`;
    const diffHrs = Math.round(diffMin / 60);
    if (diffHrs < 24) return `hace ${diffHrs} h`;
    const diffDays = Math.round(diffHrs / 24);
    if (diffDays < 30) return `hace ${diffDays} d`;
    return date.toLocaleDateString('es-CO');
  }
}
