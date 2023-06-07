import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';

const uploadUrl = '/file-upload';

export const handlers = [
  rest.get('/upload-url', (_, res, ctx) => {
    // 30 percents chance to error
    const isSucess = Math.random() < 0.7;

    if (!isSucess) {
      return res(ctx.delay(400), ctx.status(500));
    }

    return res(
      ctx.delay(1000),
      ctx.json({
        id: uuidv4(),
        uploadUrl,
      })
    );
  }),

  rest.post(uploadUrl, async (req, res, ctx) => {
    // 30 percents chance to error
    const isSucess = Math.random() < 0.7;

    if (!isSucess) {
      return res(ctx.delay(400), ctx.status(500));
    }

    const body = req.body;

    const files: File[] = Object.values(body || {}).reduce(
      (acc: File[], elem: File | File[]) =>
        Array.isArray(elem) ? [...acc, ...elem] : [...acc, elem],
      []
    );

    return res(
      ctx.delay(2000),
      ctx.json({
        data: files.map((elem) => URL.createObjectURL(elem)),
      })
    );
  }),
];
