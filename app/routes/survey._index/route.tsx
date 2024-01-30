import type { MetaFunction } from "@remix-run/cloudflare";
import { NavLink } from '@remix-run/react';

const description = `
Embark on an interactive journey with Alberto, as he explores React development using Remix, Edge deployments via Cloudflare Pages, and serverless data storage with Neon. You will learn the key advantages of Edge computing runtime platforms, and how to adapt your Remix apps for them.
Moreover, you will see how to query a Neon database using the familiar and type-safe Prisma ORM.
Finally, you will gain practical insights about the nuances and caveats of Edge platforms, as Alberto shares firsthand experiences from making the Prisma internals compatible with this innovative computing stack. Are you ready for the future?
`;

export const meta: MetaFunction = () => {
  return [
    { title: "Demo: Interactive web apps at the Edge with Remix, Neon, and Prisma" },
    { name: "description", content: description },
  ];
};

export default function Index() {
  return (
    <div className="bg-white h-full">
      <div className="max-w-screen-xl flex flex-col flex-wrap items-center justify-between mx-auto p-4">
        <h1 className="self-center text-2xl font-semibold whitespace-nowrap">Survey Demo</h1>
        <div className="w-full mt-8 md:block md:w-auto">
          <ul className="font-medium justify-center flex-col flex p-4 md:p-0 mt-4 border gap-4 border-gray-100 md:mt-0 md:border-0">
            <li>
              <NavLink to="/join" className="block py-4 px-6 bg-sapphire-700 text-white text-primary underline-offset-4 hover:underline text-center">Join Survey</NavLink>
            </li>
            <li>
              <NavLink to="/results" className="block py-4 px-6 bg-sapphire-700 text-white text-primary underline-offset-4 hover:underline text-center">View Results</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
