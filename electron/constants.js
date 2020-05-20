// Contain all the constants
const BASE_SEARCH_STRING = "http://www.omdbapi.com/?apikey=948a2d08&&"
const SEARCH_STRING_FOR_MOVIE = `${BASE_SEARCH_STRING}type=movie&&t=`
const SEARCH_STRING_FOR_SERIES = `${BASE_SEARCH_STRING}type=series&&t=`
const VALID_FILE_FORMATS = ["mp4", "mkv", "flv", "wmv"]
const NOT_FOUND_IMAGE_URL = "https://assets.prestashop2.com/sites/default/files/styles/blog_750x320/public/blog/2019/10/banner_error_404.jpg?itok=eAS4swln"

module.exports = {
    BASE_SEARCH_STRING: BASE_SEARCH_STRING,
    SEARCH_STRING_FOR_MOVIE: SEARCH_STRING_FOR_MOVIE,
    SEARCH_STRING_FOR_SERIES: SEARCH_STRING_FOR_SERIES,
    VALID_FILE_FORMATS: VALID_FILE_FORMATS,
    NOT_FOUND_IMAGE_URL: NOT_FOUND_IMAGE_URL
}