import { ActionFunction, Form, useActionData } from 'remix';
import ShortUniqueId from 'short-unique-id';
import { DuplicateIcon } from '@heroicons/react/outline';
import { db } from '~/utils/db.server';

function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const url = formData.get('url');
  if (!url) return null;
  if (!isValidHttpUrl(url.toString())) return { message: 'Is not valid url' };
  const uid = new ShortUniqueId({ length: 10 });
  const generated_uid = uid();
  await db.url.create({
    data: {
      orig_url: url.toString(),
      short_url: generated_uid,
    },
  });
  return { short_url: generated_uid };
};

export default function Index() {
  const data = useActionData();
  return (
    <div className="flex flex-col items-center h-full">
      <h1 className="p-3 pt-10 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-500">
        Url Shortener
      </h1>
      <Form method="post" className="w-1/3 pt-10 ">
        <label className="label" htmlFor="url">
          <span className="label-text">Url to shorten</span>
        </label>
        <input className="w-full input input-bordered" type="text" name="url" id="url" spellCheck={false} />
      </Form>
      {data?.short_url && (
        <div className="flex items-center px-5 py-3 mt-5 space-x-2 bg-gray-800 border border-gray-500 rounded-xl">
          <a className="hover:text-blue-500" href={`${window.location.origin}/${data.short_url}`}>
            {`${window.location.origin}/${data.short_url}`}
          </a>
          <DuplicateIcon
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/${data.short_url}`);
            }}
          />
        </div>
      )}
      {data?.message && <div className="mt-5 text-xs">{data.message}</div>}
    </div>
  );
}
