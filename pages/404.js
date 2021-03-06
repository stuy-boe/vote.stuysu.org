import Head from "next/head";
import layout from "./../styles/layout.module.css";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import HomeOutlined from "@material-ui/icons/HomeOutlined";
import { useTheme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { PUBLIC_URL } from "../constants";
import defaultImage from "./../img/404-images/searching-with-dog.png";

import { URL } from "url";
import get404Image from "../utils/errors/get404Image";
import { useEffect, useState } from "react";

const Error404 = () => {
  const theme = useTheme();
  const title = "Page Not Found | StuyBOE Voting Site";
  const description = "That page could not be found on this site";
  const [image, setImage] = useState(null);

  useEffect(() => {
    setImage(get404Image());
  }, []);

  // Server side url class is undefined on client so choose based on which is available
  const Url = globalThis?.URL || URL;

  const defaultImageUrl = new Url(defaultImage, PUBLIC_URL).href;

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={defaultImageUrl} />
        <meta property="og:image:width" content={912} />
        <meta property="og:image:height" content={912} />
        <meta
          property="og:image:alt"
          content={"Someone with their dog, looking for something"}
        />
      </Head>
      <div className={layout.container}>
        <main className={layout.main}>
          {image && (
            <img
              src={image.src}
              className={layout.largeVector}
              alt={image.alt}
            />
          )}

          <Typography variant={"h1"} align={"center"}>
            Page not found
          </Typography>

          <Link href={"/"} styles={layout.spaced}>
            <Button
              startIcon={<HomeOutlined />}
              color={"secondary"}
              variant={"contained"}
            >
              Go Back Home
            </Button>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Error404;
