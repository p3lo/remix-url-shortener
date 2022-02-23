import { useEffect } from 'react';
import { LoaderFunction, redirect, useLoaderData } from 'remix';
import { db } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ params }) => {
  let url_id: string | undefined = params.short_url;
  const get_orig_url = await db.url.findFirst({
    where: {
      short_url: url_id,
    },
    select: {
      orig_url: true,
    },
  });
  if (!get_orig_url?.orig_url) return redirect('/');
  return { get_orig_url };
};

const Redirect = () => {
  const { get_orig_url } = useLoaderData();
  useEffect(() => {
    window !== undefined;
    window.location.replace(get_orig_url.orig_url);
  });

  return <div></div>;
};

export default Redirect;
