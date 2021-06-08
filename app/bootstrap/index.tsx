// This file will invoke all bootstrap scripts to perform various house-keeping
// tasks to bootstrap the app

import { installCustomMomentLocale } from "./install-custom-moment-locale";

export function bootstrap() {
  installCustomMomentLocale();
}
