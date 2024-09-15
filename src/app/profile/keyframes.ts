import { keyframes, style,animate } from "@angular/animations";

export const swiperight = [
  style({ opacity: 0 }),
  style({ transform: 'rotateY(90deg)' }),
  style({ transform: 'rotateY(0eg)' }),
  style({ opacity: 1}),
]

export const swipeleft = [
  style({ opacity: 0 }),
  style({ transform: 'rotateY(90deg)' }),
  style({ transform: 'rotateY(0eg)' }),
  style({ opacity: 1}),
]


  