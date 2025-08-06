import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes/Router";
import { Provider } from "react-redux";
import ThemeProvider from "./context/Theme/ThemeProvider";
import store from "./store/store";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
