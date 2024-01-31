import { useEffect, useRef } from 'react'
import { useFetcher, useNavigate, useLoaderData } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { useToast } from '~/components/ui/use-toast'
import { ActionFunctionArgs, json } from '@remix-run/cloudflare'
import { validateCityValue } from './validate'
import { choices } from '~/lib/choices'
import { getNSubmissions, incrementNSubmissions } from '~/lib/submissions'
import { getPrisma } from '~/lib/prisma.server'

// Metadata for the `/survey/join` page.
export const meta = () => {
  return [{ title: 'Join Survey' }]
}

// The `loader` function block runs on the server and client.
// You can use it to fetch data on the server before the page is rendered.
//
// Here, we only use it to keep track of how many times this client has
// submitted the form on this page.
export async function loader() {
  const nSubmissions = getNSubmissions()

  return json({ nSubmissions }, 200)
}

// The `action` function responds to form submissions.
export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData()
  const cityValue = String(formData.get('city') || '')

  const { error: cityError, value: validatedCityValue } = await validateCityValue(cityValue)

  if (cityError) {
    return json({
      ok: false,
      error: cityError,
    } as const, 400)
  }

  const prisma = getPrisma(context.env)

  try {
    const createdSurvey = await prisma.survey.create({
      data: {
        city: {
          connect: {
            name: validatedCityValue,
          },
        },
      },
      include: {
        city: true,
      },
    })

    const { name: value, label } = createdSurvey.city
    const city = { value, label }
  
    incrementNSubmissions()

    return json({ ok: true, errors: null, city } as const, 200)
  } catch (_) {
    const dbError = 'Cannot connect to the database.'

    return json({
      ok: false,
      error: dbError,
    } as const, 500)
  }
}

export default function Create() {
  const navigate = useNavigate()
  const handleNavigateBack = () => navigate(-1)

  const loaderData = useLoaderData<typeof loader>()

  const fetcher = useFetcher<typeof action>()
  const actionResult = fetcher.data

  const isSubmitting = fetcher.state === 'submitting'
    && fetcher.formData?.get('_action') === 'submit'

  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()

  // Reset the form on successful submission.
  useEffect(function onSubmitResult() {
    if (fetcher.state === 'loading') {

      const toastDuration = 3000

      if (actionResult?.ok) {
        toast({
          title: 'Answer submitted successfully',
          description: actionResult.city.label,
          duration: toastDuration,
        })
      } else {
        toast({
          title: 'Answer could not be submitted',
          duration: toastDuration,
          variant: 'destructive',
        })
      }

      formRef.current?.reset()
    }
  }, [isSubmitting])

  return (
    <div className="bg-white h-full rounded-md shadow-md flex items-center justify-center relative">
      <Button className="absolute top-0 left-0" variant="link" onClick={handleNavigateBack}>Go back</Button>
      <div className="max-w-screen-xl flex flex-col flex-wrap items-center justify-between mx-auto p-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
          <fetcher.Form
            ref={formRef}
            className="space-y-6"
            method="post"
          >
            <h2 className="text-xl text-bold text-center drop-shadow-sm">
              What is your favourite Polish city?
            </h2>

            <ul className="grid w-full gap-2 md:grid-cols-2">
              {
                choices.map(({ label, value }) => (
                  <li key={`key-${value}`}>
                    <input type="radio" id={`radio-${value}`} name="city" value={value} className="hidden peer" />
                    <label htmlFor={`radio-${value}`} className="inline-flex items-center justify-between gap-2 w-full p-4 text-gray-500 bg-white border border-gray-200 cursor-pointer peer-checked:border-sapphire-500 peer-checked:text-sapphire-500 rounded-md shadow-sm">
                      <div className="block w-full text-lg font-semibold text-center">{label}</div>
                    </label>
                  </li>
                ))
              }
            </ul>

            <Button
              disabled={isSubmitting}
              type="submit"
              size="lg"
              name="_action"
              value="submit"
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>

            <div className="w-full">
              {''}
              {actionResult && !actionResult.ok && (
                <span id="city-error" className="text-red-500 text-sm">
                  {actionResult.error}
                </span>
              )}
            </div>
          </fetcher.Form>
        </div>
        {
          loaderData.nSubmissions > 0 && (
            <div className='text-sm'>
              <p>Your answers were recorded <span className="text-bold">{loaderData.nSubmissions} times</span> during this session.</p>
            </div>
          )
        }
      </div>
    </div>
  )
}