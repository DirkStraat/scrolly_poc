import React, { useLayoutEffect, useState } from "react";
import { parseXMLToJSON } from "@fdmg/article-xml-json";
import { Article } from "../components/article/Article";

export default function Home(props: any) {
  return (
    <>
      {props.data.map((article) => {
        return <Article article={article} key={article.id} />;
      })}
    </>
  );
}

export async function getStaticProps() {
  const articleIds = [1408272, 1408271];
  const requestOptions = {
    method: "GET",
    headers: {
      "x-access-token": `Bearer ${process.env.ARTICLE_SERVICE_TOKEN_PROD}`,
    },
  };
  let data = [];

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async function getArticles(articleIds: number[]) {
    const articles = [];
    await asyncForEach(articleIds, async (articleId: number) => {
      try {
        await fetch(
          `https://api.fdmg.org/private/fd/articles/${articleId}`,
          requestOptions
        )
          .then((res) => res.json())
          .then((article) => articles.push(article));
      } catch (e) {
        console.error(e);
      }
    });
    return articles;
  }

  function separateContent(articleContent) {
    const tempSeparatedContent = [];
    let indexContent = 0;
    articleContent.map((element) => {
      if (element.name == "h2") {
        if (tempSeparatedContent.length > 0) {
          indexContent++;
        }
        tempSeparatedContent.push([]);
        tempSeparatedContent[indexContent].push(element);
      } else if (element.name == "p" || element.name == "fdmg-quote") {
        if (!tempSeparatedContent.length) {
          tempSeparatedContent.push([]);
          tempSeparatedContent[indexContent].push(element);
        } else tempSeparatedContent[indexContent].push(element);
      }
    });
    return tempSeparatedContent;
  }

  try {
    data = await getArticles(articleIds);
    data.map((article) => {
      const parsedContent = parseXMLToJSON(article.content);
      article.separatedContent = separateContent(parsedContent);
    });
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      data,
    },
    revalidate: 60,
  };
}
