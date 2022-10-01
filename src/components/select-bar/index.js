/* eslint-disable no-unused-expressions */
import { useState, useEffect } from "react";
import {
  SelectBarWrapper,
  ConversationCardWrapper,
  PersonDetails,
  PaginationWrapper,
} from "./styles";
import axios from "axios";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Pagination } from "antd";
import conversations1 from "../../conversations/conversations1.json";
import conversations2 from "../../conversations/conversations2.json";
import conversations3 from "../../conversations/conversations3.json";

export const SelectBar = ({
  selectedId,
  setSelectedId,
  selectedConversation,
  setSelectedConversation,
  sortingState,
  fetchApiToggler,
  loadingSelectState,
  setLoadingSelectState,
  loadingShowingState,
  setLoadingShowingState,
  selectedPage,
}) => {
  const [conversationsList, setConversationsList] = useState([]);
  const [numberOfDbResults, setNumberOfDbResults] = useState(0);
  const [actualPage, setActualPage] = useState(0);

  const getCorrectConversation = () => {
    if (selectedPage === 3) {
      return conversations1;
    }
    if (selectedPage === 2) {
      return conversations2;
    }
    if (selectedPage === 1) {
      return conversations3;
    }
  };
  const conversations = getCorrectConversation();

  const getBadge = (id) => {
    const conv1 = conversations1.find(
      (item) => item.personOne === id || item.personTwo === id
    )
      ? 1
      : 0;
    const conv2 = conversations2.find(
      (item) => item.personOne === id || item.personTwo === id
    )
      ? 1
      : 0;
    const conv3 = conversations3.find(
      (item) => item.personOne === id || item.personTwo === id
    )
      ? 1
      : 0;
    return 0 + conv1 + conv2 + conv3;
  };

  const fetchApi = async (page, limit, sort_by, increasing) => {
    try {
      const fetchedData = conversations;
      setNumberOfDbResults(fetchedData.length);
      if (sortingState === "date") {
        setConversationsList(
          fetchedData
            .sort(function (a, b) {
              return new Date(b.date) - new Date(a.date);
            })
            .slice(actualPage * 10, (actualPage + 1) * 10)
        );
      }
      if (sortingState === "number") {
        setConversationsList(
          fetchedData
            .sort((a, b) => b.__v - a.__v)
            .slice(actualPage * 10, (actualPage + 1) * 10)
        );
      }

      setLoadingSelectState(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApi(actualPage, 10, "date", false);
  }, [sortingState, fetchApiToggler, fetchApi, actualPage]);

  return (
    <div>
      <SelectBarWrapper>
        {loadingSelectState ? (
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
              type='Oval'
              color='#00BFFF'
              height={100}
              width={100}
              timeout={10000} //3 secs
            />
          </div>
        ) : (
          <>
            {conversationsList.map((item) => (
              <ConversationCardWrapper
                key={item._id}
                onClick={() => {
                  setLoadingShowingState(true);
                  setSelectedId({
                    id: item._id,
                    personOne: item.personOne,
                    personTwo: item.personTwo,
                    personOneDetails: item.personOneDetails,
                    personTwoDetails: item.personTwoDetails,
                  });
                }}
                cardColor={item._id === selectedId.id ? "#1360e8" : "#ecb800"}
                borderColor={item._id === selectedId.id ? "red" : "#ecb800"}
              >
                <div className='tooltip'>
                  <span
                    className='tooltiptext'
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
                  <div
                    style={{
                      display: "flex",
                      position: "absolute",
                      top: 50,
                      backgroundColor: "black",
                      height: 20,
                      width: 20,
                      justifyContent: "center",
                      borderRadius: 10,
                      color: "white",
                    }}
                  >
                    {getBadge(item.personTwo)}
                  </div>
                  <img
                    src={`http://avatars.gadu-gadu.pl/${item.personTwo}?default=http://avatars.gg.pl/default,100`}
                    alt='User avatar'
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
                  <div style={{ textAlign: "center" }}>{`Rozmowa ${
                    item.personOneDetails[0] &&
                    item.personOneDetails[0] !== "nick:niepodano"
                      ? `${item.personOneDetails[0].substring(5)} (${
                          item.personOne
                        })`
                      : item.personOne
                  } z ${
                    item.personTwoDetails[0] &&
                    item.personTwoDetails[0] !== "nick:niepodano"
                      ? `${item.personTwoDetails[0].substring(5)} (${
                          item.personTwo
                        })`
                      : item.personTwo
                  }`}</div>
                  <div>{`Wymienili ${item.__v} wiadomości`}</div>
                </div>

                <div className='tooltip'>
                  <span
                    className='tooltiptext'
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
                  <div
                    style={{
                      display: "flex",
                      position: "absolute",
                      top: 50,
                      backgroundColor: "black",
                      height: 20,
                      width: 20,
                      justifyContent: "center",
                      borderRadius: 10,
                      color: "white",
                    }}
                  >
                    {getBadge(item.personOne)}
                  </div>
                  <img
                    src={`https://avatars.gg.pl/user,${item.personOne}/s,100x100`}
                    alt='User avatar'
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
      <PaginationWrapper>
        <Pagination
          defaultCurrent={1}
          total={numberOfDbResults}
          onChange={(e) => {
            setLoadingSelectState(true);
            setActualPage(e - 1);
            fetchApi(e - 1, 10, "date", false);
          }}
          showSizeChanger={false}
        />
      </PaginationWrapper>
    </div>
  );
};
