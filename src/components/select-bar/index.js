import { useState, useEffect } from "react";
import { SelectBarWrapper, ConversationCardWrapper } from "./styles";
import axios from "axios";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export const SelectBar = ({
  selectedId,
  setSelectedId,
  selectedConversation,
  setSelectedConversation,
  sortingState,
  fetchApiToggler,
}) => {
  const [conversationsList, setConversationsList] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const fetchApi = async () => {
    // setLoadingState(true);
    try {
      const fetchedData = await axios.get(
        "https://gg-api-app.herokuapp.com/conversations"
      );
      if (sortingState === "date") {
        setConversationsList(
          fetchedData.data.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
          })
        );
      }
      if (sortingState === "number") {
        console.log(sortingState);
        setConversationsList(fetchedData.data.sort((a, b) => b.__v - a.__v));
      }

      setLoadingState(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApi();
  }, [sortingState, fetchApiToggler]);

  return (
    <SelectBarWrapper>
      {loadingState ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Loader
            type="Oval"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : (
        <>
          {conversationsList.map((item) => (
            <ConversationCardWrapper
              key={item._id}
              onClick={() => {
                setSelectedId({
                  id: item._id,
                  personOne: item.personOne,
                  personTwo: item.personTwo,
                });
              }}
              cardColor={item._id === selectedId.id ? "#1360e8" : "#ecb800"}
              borderColor={item._id === selectedId.id ? "red" : "#ecb800"}
            >
              <div className="tooltip">
                <span
                  className="tooltiptext"
                  style={{
                    left: "-350px",
                    top: "70px",
                    height: "350px",
                    width: "350px",
                  }}
                >
                  <img
                    src={`https://avatars.gg.pl/user,${item.personTwo}/s,500x500`}
                    alt={`${item.personTwo}'s avatar`}
                  />
                </span>
                <img
                  src={`http://avatars.gadu-gadu.pl/${item.personTwo}?default=http://avatars.gg.pl/default,100`}
                  alt="User avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://www.pathwaysvermont.org/wp-content/uploads/2017/03/avatar-placeholder-e1490629554738.png";
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div>{`Rozmowa ${item.personOne} z ${item.personTwo}`}</div>
                <div>{`Wymienili ${item.__v} wiadomości`}</div>
              </div>

              <div className="tooltip">
                <span
                  className="tooltiptext"
                  style={{
                    left: "70px",
                    top: "70px",
                    height: "350px",
                    width: "350px",
                  }}
                >
                  <img
                    src={`https://avatars.gg.pl/user,${item.personOne}/s,500x500`}
                    alt={`${item.personOne}'s avatar`}
                  />
                </span>
                <img
                  src={`https://avatars.gg.pl/user,${item.personOne}/s,100x100`}
                  alt="User avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://www.pathwaysvermont.org/wp-content/uploads/2017/03/avatar-placeholder-e1490629554738.png";
                  }}
                />
              </div>
            </ConversationCardWrapper>
          ))}
        </>
      )}
    </SelectBarWrapper>
  );
};
