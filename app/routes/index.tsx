import { ActionFunction, Form, useActionData } from 'remix';
import ShortUniqueId from 'short-unique-id';
import { DuplicateIcon } from '@heroicons/react/outline';

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
  return { short_url: `http://localhost:3000/${uid()}` };
};

export default function Index() {
  const data = useActionData();
  return (
    <div className="flex flex-col h-full  items-center">
      <h1 className="p-3 text-4xl pt-10 font-extrabold">Url Shortener</h1>
      <Form method="post" className=" pt-10 w-1/3">
        <label className="label" htmlFor="url">
          <span className="label-text">Url to shorten</span>
        </label>
        <input className="input input-bordered w-full" type="text" name="url" id="url" spellCheck={false} />
      </Form>
      {data?.short_url && (
        <div className="mt-5 py-3 px-5 border rounded-xl bg-gray-800 flex space-x-2 items-center border-gray-500">
          <a className="hover:text-blue-500" href={data.short_url}>
            {data.short_url}
          </a>
          <DuplicateIcon
            className="h-6 w-6 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(data.short_url);
            }}
          />
        </div>
      )}
      {data?.message && <div className="mt-5 text-xs">{data.message}</div>}
    </div>
  );
}
