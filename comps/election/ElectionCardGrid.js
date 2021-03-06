import styles from "./ElectionCardGrid.module.css";
import Grid from "@material-ui/core/Grid";
import ElectionCard from "./ElectionCard";
import Pagination from "@material-ui/lab/Pagination";
import Typography from "@material-ui/core/Typography";
import searching from "./../../img/searching.svg";

const ElectionCardGrid = ({ page, results, numPages, onPageChange, admin }) => {
  if (!numPages) {
    return (
      <div className={styles.notFoundContainer}>
        <img
          src={searching}
          alt={
            "Someone with a magnifying glass pointed at the ground, searching"
          }
          className={styles.notFoundImage}
        />
        <Typography paragraph>
          There are no elections that match the given criteria
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Grid container className={styles.grid} justify={"center"}>
        {results?.map(({ name, url, picture, id, start, end }) => (
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={id}>
            <div className={styles.itemContainer}>
              <ElectionCard
                name={name}
                picture={picture}
                start={start}
                end={end}
                href={admin ? "/admin/election/" + id : "/election/" + url}
              />
            </div>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={numPages}
        page={page}
        onChange={onPageChange}
        className={styles.pagination}
      />
    </div>
  );
};

export default ElectionCardGrid;
