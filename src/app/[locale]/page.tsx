import { getTranslations, setRequestLocale } from "next-intl/server";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

const Home = async ({ params }: Readonly<HomeProps>) => {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations("common");

  return (
    <h1>{t("brand")}</h1>
  );
};

export default Home;
