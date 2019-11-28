// eslint-disable-next-line import/no-extraneous-dependencies
import { sineOut } from 'svelte/easing';

const duration = 250;
const delay = duration;

const delayZero = 0;

export const fadeIn = () => ({
  duration,
  delay,
  easing: sineOut,
  css: t => `opacity: ${t}`
});

export const fadeOut = () => ({
  duration,
  delayZero,
  easing: sineOut,
  css: t => `opacity: ${t}`
});
