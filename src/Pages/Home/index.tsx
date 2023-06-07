import { useEffect, useState } from "react";
import { MovieCard, Spinner } from "../../Components";
import { ERROR_MESSAGE, MOVIE_TYPES, NotificationType } from "../../constant";
import { apiGetMovies } from "../../Api";
import {
  Row,
  Col,
  Input,
  Pagination,
  Select,
  Button,
  notification,
} from "antd";
import {
  IMovie,
  FilterOptions,
  IResponseMoviesSuccess,
  IResponseError,
} from "../../types";
import { appendApiKey } from "../../utils";
import { SearchOutlined } from "@ant-design/icons";

import "./index.scss";

export const Home = () => {
  const [movies, setMovies] = useState<IResponseMoviesSuccess | IResponseError>(
    {} as IResponseMoviesSuccess
  );
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    s: "",
    type: "",
    page: "1",
  });
  const [searchValue, setSearchValue] = useState<string>("");
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

  const suffix = (
    <label
      className="cursor-pointer"
      style={{
        fontSize: 16,
        color: "#ccc",
      }}
      onClick={() => {
        setSearchValue("");
      }}
    >
      {searchValue ? "x" : ""}
    </label>
  );

  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = async () => {
    if (searchValue.length >= 3) {
      setIsLoading(true);
      try {
        delete filterOptions.s;
        for (let key in filterOptions) {
          if (!filterOptions[key as keyof typeof filterOptions]) {
            delete filterOptions[key as keyof typeof filterOptions];
          }
        }
        const filterParams = new URLSearchParams(filterOptions).toString();
        const result = await apiGetMovies(
          appendApiKey("/", "?s=" + searchValue + `&${filterParams}`)
        );

        if (result.Response === "False")
          openNotificationWithIcon("error", result?.Error);
        else setFilterOptions({ ...filterOptions, s: searchValue, page: "1" });
        setMovies(result);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      openNotificationWithIcon("error", ERROR_MESSAGE.SEARCH_MESSAGE);
    }
  };

  const handleFilterType = (type: string) => {
    if (type) setFilterOptions({ ...filterOptions, type });
    else setFilterOptions({ ...filterOptions, type: "" });
  };

  const handleChangePage = (current: number, _pageSize: number) => {
    if (current) {
      setFilterOptions({ ...filterOptions, page: current.toString() });
    } else setFilterOptions({ ...filterOptions });
  };

  useEffect(() => {
    const getMovies = async () => {
      const filterParams = new URLSearchParams(filterOptions).toString();
      const result = await apiGetMovies(appendApiKey("/", `?${filterParams}`));
      if (result?.Response === "True") setMovies(result);
      else openNotificationWithIcon("error", result?.Error);
    };

    if (filterOptions.s) getMovies();
  }, [filterOptions.page]);

  return (
    <div className="home">
      {contextHolder}
      <h1 className="my-5 text-center font-bold">Home</h1>

      <div className="search-bar flex gap-3 mb-5 justify-center">
        <Row
          className="w-full xl:w-6/12 md:w-full sm:w-full"
          justify={"space-between"}
          gutter={[
            { xl: 40, md: 24, sm: 16, xs: 6 },
            { xl: 40, md: 24, sm: 16, xs: 6 },
          ]}
        >
          <Col span={6} xl={12} md={8} sm={24} xs={24}>
            <Input
              className="w-full"
              placeholder="Enter movie name"
              value={searchValue}
              onChange={onHandleChange}
              suffix={suffix}
            />
          </Col>
          <Col span={6} xl={6} md={8} sm={24} xs={24}>
            <Select
              className="w-full"
              placeholder={"Select type"}
              onChange={handleFilterType}
              options={MOVIE_TYPES}
              allowClear
            />
          </Col>
          <Col span={6} xl={6} md={8} sm={24} xs={24}>
            <Button
              className="search-btn w-full"
              type="primary"
              name="search-movie"
              icon={<SearchOutlined rev={undefined} className="text-black" />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Col>
        </Row>
        {/* </div> */}
      </div>

      <div className="body relative" id="main">
        {!isLoading ? (
          <main className="main">
            {movies.Response === "True" && movies?.Search?.length > 0 ? (
              <div>
                <h3 className="mb-5">Result for: {filterOptions.s}</h3>
                <Row
                  wrap={true}
                  justify={"start"}
                  gutter={[
                    { xl: 40, md: 24, sm: 16, xs: 8 },
                    { xl: 40, md: 24, sm: 16, xs: 8 },
                  ]}
                >
                  {movies?.Search.map((movie: IMovie) => (
                    <Col
                      key={movie.imdbID}
                      span={6}
                      xl={6}
                      md={8}
                      sm={12}
                      xs={24}
                    >
                      <MovieCard movie={movie} />
                    </Col>
                  ))}
                </Row>
              </div>
            ) : (
              movies.Response && (
                <Col span={24} className="text-center">
                  {ERROR_MESSAGE.MOVIE_NOT_FOUND}
                </Col>
              )
            )}

            {movies?.Response === "True" && (
              <div className="text-center">
                <Pagination
                  className="mt-5 py-5"
                  showSizeChanger={false}
                  onChange={handleChangePage}
                  current={Number(filterOptions.page)}
                  total={movies.totalResults}
                />
              </div>
            )}
          </main>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};
