import { getProcessedLLMText, source } from '#/fumadocs/source';

export const revalidate = false;

export const GET = async () => {
  const scan = source.getPages().map(getProcessedLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'));
};
