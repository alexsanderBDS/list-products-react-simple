import { useState, useEffect } from "react";
import "./App.scss";
// import {list} from './temp'

function App() {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [menuOptions, setMenuOptions] = useState({
    shirt: true,
    pant: true,
    shoe: true,
    findings: [],
    inputText: "",
    listApi: [],
  });

  useEffect(() => {
    fetch("http://localhost:4000/data")
      .then((data) => {
        data.json().then((res) => {
          setMenuOptions((prevOp) => {
            return { ...prevOp, listApi: res.data };
          });
        });
      })
      .catch((error) => console.log(error));
    return () => "";
  }, []);

  const checkboxChanged = ({ target }) => {
    switch (target.name) {
      case "shirts":
        setMenuOptions((prevOp) => {
          return { ...prevOp, shirt: !menuOptions.shirt };
        });
        break;

      case "pants":
        setMenuOptions((prevOp) => {
          return { ...prevOp, pant: !menuOptions.pant };
        });
        break;

      case "shoes":
        setMenuOptions((prevOp) => {
          return { ...prevOp, shoe: !menuOptions.shoe };
        });
        break;
      default:
        break;
    }
  };

  const List = () => {
    const fullView = (e) => {
      e.preventDefault();
      console.log("Show details.");
    };

    return menuOptions.listApi.map((brand) => {
      return brand.products.map((product) => {
        const filter = product.items.filter((item) => {
          return (
            item.category !== (!menuOptions.shirt ? "shirts" : "") &&
            item.category !== (!menuOptions.pant ? "pants" : "") &&
            item.category !== (!menuOptions.shoe ? "shoes" : "")
          );
        });

        return filter.map((item) => {
          return (
            <>
              <ul className="products">
                <li key={"a" + item.id}>
                  <img src={item.photo} alt={item.name.replace(" ", "_")} />
                </li>
                <li key={"c" + item.id}>
                  <a href="./full-view" onClick={fullView}>
                    {item.name}
                  </a>
                </li>
                <li key={"b" + item.id}>Preço: {item.price}</li>
              </ul>
            </>
          );
        });
      });
    });
  };

  useEffect(() => {
    menuOptions.listApi.forEach((product) => {
      product.products.forEach(({ items }) => {
        const response = items.filter((one) => {
          return one.name.toLowerCase().includes(menuOptions.inputText);
        });

        return setMenuOptions((prevOp) => {
          return { ...prevOp, findings: response };
        });
      });
    });
  }, [menuOptions.inputText]);

  const handleSidebar = (e) => {
    e.preventDefault();
    setSidebarStatus(!sidebarStatus);
  };

  const seachOnly = () => {
    // Show some informations on console upon click buscar button.
    console.log(menuOptions.inputText);
    console.log(menuOptions.findings);
  };

  const changeInput = (e) => {
    setMenuOptions((prevOp) => {
      return { ...prevOp, inputText: e.target.value.toLowerCase() };
    });
  };

  return (
    <div
      className="App"
      style={{
        gridTemplateColumns: sidebarStatus ? "250px auto" : "50px auto",
      }}
    >
      <div
        className="sidebar"
        style={{ background: sidebarStatus ? "grey" : "none" }}
      >
        {sidebarStatus ? (
          <>
            <button className="hideSidebar" href="./" onClick={handleSidebar}>
              x
            </button>
            <h3>Menu</h3>
            <ul key={"menu-items"}>
              <li key="shirts">
                <label>Shirts</label>
                <input
                  type="checkbox"
                  name="shirts"
                  onChange={checkboxChanged}
                  checked={menuOptions.shirt}
                />
              </li>
              <li key="pants">
                <label>Pants</label>
                <input
                  type="checkbox"
                  name="pants"
                  onChange={checkboxChanged}
                  checked={menuOptions.pant}
                />
              </li>
              <li key="shoes">
                <label>Shoes</label>
                <input
                  type="checkbox"
                  name="shoes"
                  onChange={checkboxChanged}
                  checked={menuOptions.shoe}
                />
              </li>
            </ul>
          </>
        ) : (
          <button className="showSidebar" onClick={handleSidebar}>
            &#9776;
          </button>
        )}
      </div>

      <div className="top">
        <input onChange={changeInput} placeholder="Buscar" type="text" />
        <button onClick={seachOnly}>Buscar</button>
      </div>

      <div className="content">
        {menuOptions.listApi.length === 0 ? (
          <h1 className="message">
            Please Run backend: 'npm start' or 'npm run dev'
          </h1>
        ) : (
          <List />
        )}
      </div>
    </div>
  );
}

export default App;
