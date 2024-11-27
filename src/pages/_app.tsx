import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import Layout from "~/components/Layout"; // Import do layout
import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
};

// Envolvendo com ambos os wrappers (appWithTranslation e withTRPC)
export default api.withTRPC(MyApp);
