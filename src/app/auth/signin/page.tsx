import { Redirect } from "./client";

interface IPageProps {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}

export default async function Page(props: IPageProps) {
  const { callbackUrl } = await props.searchParams;

  return <Redirect method="keycloak" callbackUrl={callbackUrl} />;
}
