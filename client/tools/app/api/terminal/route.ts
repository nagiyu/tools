import { getHandler } from '@client-common/routes/terminal/route';

import { ROOT_FEATURE } from '@tools/consts/ToolsConsts';

export async function GET() {
  return getHandler(ROOT_FEATURE);
}
