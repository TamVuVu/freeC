import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ERROR_MESSAGE, NotificationType, fallbackImage } from "../../constant";
import { apiGetMovieDetails } from "../../Api";
import { Image, Row, Col, notification } from "antd";
import { IResponseError, IResponseMovieDetailsSuccess } from "../../types";
import { Spinner } from "../../Components";
import { appendApiKey } from "../../utils";

import "./index.scss";

export const MoviesDetails = () => {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState<
    IResponseMovieDetailsSuccess | IResponseError
  >({} as IResponseMovieDetailsSuccess);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    message?: string
  ) => {
    api[type]({
      message: type,
      description: message,
    });
  };

  useEffect(() => {
    const getMovie = async () => {
      setIsLoading(true);
      try {
        const result = await apiGetMovieDetails(
          appendApiKey("/", "?i=" + movieId)
        );
        setMovieDetails(result);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (movieId) getMovie();
  }, [movieId]);

  useEffect(() => {
    if (movieDetails.Response === "False")
      openNotificationWithIcon("error", movieDetails.Error);
  }, [movieDetails.Response]);

  if (isLoading) return <Spinner />;
  return (
    <>
      <div className="movie-details">
        {contextHolder}
        {movieDetails.Response === "True" ? (
          <>
            <h1 className="mb-3 text-center font-bold">Movie details</h1>
            <div
              className="banner flex no-wrap"
              style={{
                backgroundImage: "url(" + movieDetails.movie.Poster + ")",
              }}
            >
              <div className="banner-content w-full">
                <Row align={"middle"} gutter={24} wrap={true}>
                  <Col span={6} xl={6} md={6} sm={24} xs={24}>
                    <div className="text-center">
                      <Image
                        className="w-full"
                        alt={movieDetails.movie.Title}
                        src={movieDetails.movie.Poster}
                        fallback={fallbackImage}
                      />
                    </div>
                  </Col>
                  <Col span={18} xl={18} md={18} sm={24} xs={24}>
                    <section className="info text-white">
                      <div>
                        <h2 className="font-bold">
                          {movieDetails.movie.Title} - {movieDetails.movie.Year}
                        </h2>
                        <p className="font-bold">
                          Type: {movieDetails.movie.Type}
                        </p>
                        <p className="font-bold">Overview</p>
                        <p>{movieDetails.movie.Plot}</p>
                      </div>
                    </section>
                  </Col>
                </Row>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">{ERROR_MESSAGE.MOVIE_NOT_FOUND}</div>
        )}
      </div>
    </>
  );
};
