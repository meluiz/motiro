import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { type NextRequest, NextResponse } from 'next/server';

import { application } from '@/configs/application';

const { rewrite: rewriteDocs } = rewritePath(
  `${application.routes.docs}{/*path}`,
  `${application.routes.content}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${application.routes.docs}{/*path}.md`,
  `${application.routes.content}{/*path}/content.md`,
);

export default function proxy(request: NextRequest) {
  const result = rewriteSuffix(request.nextUrl.pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl), {
        // this URL has two representations, selected by `Accept`
        headers: { Vary: 'Accept' },
      });
    }
  }

  return NextResponse.next();
}
