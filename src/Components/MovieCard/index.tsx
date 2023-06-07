import { Card, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { IMovie } from "../../types";
import { fallbackImage } from "../../constant";

import "./index.scss";

type MovieCardPropsType = {
  movie: IMovie;
  className?: string;
};
const { Meta } = Card;

export const MovieCard = ({ movie, className }: MovieCardPropsType) => {
  const navigate = useNavigate();

  return (
    <Card
      className={"movie-card " + className}
      onClick={() => navigate("../movies/" + movie.imdbID)}
      hoverable
      cover={
        <Image
          alt={movie.Title + " Movie"}
          src={movie.Poster}
          height={300}
          fallback={fallbackImage}
          preview={false}
        />
      }
      loading={false}
      title={movie.Type.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
    >
      <Meta title={movie.Title} description={"Year: " + movie.Year} />
    </Card>
  );
};
