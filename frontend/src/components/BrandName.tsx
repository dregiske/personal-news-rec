import { APP_NAME, APP_SHORT_NAME } from '../constants';

/**
 * Renders the brand name with the primary-color accent on the short name.
 * Inherits font size, weight, and color from the parent — add those there.
 */
export default function BrandName() {
  // Split "The Fray" into prefix + accent so the split stays in sync with the constants.
  const prefix = APP_NAME.replace(APP_SHORT_NAME, '');
  return (
    <>
      {prefix}<span className="text-fray-primary">{APP_SHORT_NAME}</span>
    </>
  );
}
