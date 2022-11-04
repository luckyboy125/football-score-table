import { ThemeProvider, useTheme } from "@material-ui/core/styles";
import FootballScoreTable from "./Pages/FootballScoreTable";
import "./styles.css";

function App() {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <FootballScoreTable />
    </ThemeProvider>
  );
}

export default App;
