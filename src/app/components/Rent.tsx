"use client";
import React, { useCallback, useEffect, useState } from "react";

const Rent = () => {
  const [values, setValues] = useState<{
    no: number;
    platform: string;
    car: string;
    period: string;
    rent: string;
    distance: string;
    firstCost: string;
    secondCost: string;
    thirdCost: string;
  }>({
    no: null,
    platform: "쏘카",
    car: "",
    period: "",
    rent: "",
    distance: "",
    firstCost: "",
    secondCost: "",
    thirdCost: "",
  });
  const [totalCost, setTotalCost] = useState<number>(0);
  const [list, setList] = useState<
    {
      no: number;
      platform: string;
      car: string;
      period: string;
      distance: string;
      cost: number;
    }[]
  >([]);

  /**
   * 렌트비용, 주행거리, 주행거리별 금액으로 총 예상금액 계산
   * @param rent number
   * @param distance number
   * @param firstCost number
   * @param secondCost number
   * @param thirdCost number
   * @returns
   */
  const calculate = (
    rent: number,
    distance: number,
    firstCost: number,
    secondCost: number,
    thirdCost: number
  ): number => {
    if (distance <= 30) {
      return rent + distance * firstCost;
    } else if (distance <= 100) {
      return rent + 30 * firstCost + (distance - 30) * secondCost;
    } else {
      return (
        rent + 30 * firstCost + 70 * secondCost + (distance - 100) * thirdCost
      );
    }
  };

  /**
   * 입력창 onChange
   * @param e input change event
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (["car", "period"].includes(name)) {
      setValues((prevState) => ({ ...prevState, [name]: value }));
    } else if (/^[0-9]*$/.test(value)) {
      setValues((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  /**
   * 입력값이 바뀌면 자동 계산
   */
  useEffect(() => {
    const rent = Number(values.rent);
    const distance = Number(values.distance);
    const firstCost = Number(values.firstCost);
    const secondCost = Number(values.secondCost);
    const thirdCost = Number(values.thirdCost);
    const cost = calculate(rent, distance, firstCost, secondCost, thirdCost);
    setTotalCost(cost);
  }, [values]);

  /**
   * 저장
   */
  const handleSave = useCallback(() => {
    if (
      values.car === "" ||
      values.period === "" ||
      values.distance === "" ||
      values.firstCost === "" ||
      values.secondCost === "" ||
      values.thirdCost === ""
    ) {
      return alert("차종, 렌트비용, 주행거리 및 금액을 입력하세요.");
    }
    // local storage에 목록 저장
    localStorage.setItem(
      "rentList",
      JSON.stringify([
        ...list,
        {
          no: list[list.length - 1].no + 1,
          platform: values.platform,
          car: values.car,
          period: values.period,
          distance: values.distance,
          cost: totalCost,
        },
      ])
    );
    // list 업데이트
    setList((prevList) => [
      ...prevList,
      {
        no: prevList[prevList.length - 1].no + 1,
        platform: values.platform,
        car: values.car,
        period: values.period,
        distance: values.distance,
        cost: totalCost,
      },
    ]);
    // 입력창 초기화
    setValues((prevState) => ({
      ...prevState,
      car: "",
      rent: "",
      firstCost: "",
      secondCost: "",
      thirdCost: "",
    }));
  }, [values, totalCost, list]);

  useEffect(() => {
    console.log("localStorage");
    if (localStorage) {
      const rentListStr = localStorage.getItem("rentList");
      const list = rentListStr ? JSON.parse(rentListStr) : [];
      console.log("list", list);
      setList(list);
    }
  }, [typeof window === "undefined" || localStorage]);

  /**
   * 목록 초기화
   */
  const handleInit = () => {
    console.log("handleInit");
    localStorage.removeItem("rentList");
  };

  /**
   * 플랫폼 선택 라디오 버튼
   * @param platform "쏘카" | "그린카"
   */
  const handlePlatform = (platform) => {
    setValues((prevState) => ({
      ...prevState,
      platform,
    }));
  };

  /**
   * 삭제 핸들러
   * @param no number
   */
  const handleClick = (no) => {
    if (window.confirm("삭제 하시겠습니까?")) {
      const leftList = list.filter((v) => v.no !== no);
      localStorage.setItem("rentList", JSON.stringify(leftList));
      setList(leftList);
    }
  };

  return (
    <div>
      <div className="input_container">
        <div className="row">
          <label>플랫폼</label>
          <span className="platform-container">
            <span
              className={`platform ${
                values.platform === "쏘카" ? " active" : ""
              }`}
              onClick={() => handlePlatform("쏘카")}
            >
              쏘카
            </span>
            <span
              className={`platform ${
                values.platform === "그린카" ? " active" : ""
              }`}
              onClick={() => handlePlatform("그린카")}
            >
              그린카
            </span>
          </span>
        </div>
        <div className="row">
          <label>차종</label>
          <input name="car" value={values.car} onChange={onChange} />
        </div>
        <div className="row">
          <label>이용기간</label>
          <input name="period" value={values.period} onChange={onChange} />
        </div>
        <div className="row">
          <label>렌트 비용</label>
          <input name="rent" value={values.rent} onChange={onChange} />
        </div>
        <div className="row">
          <label>예상 주행 거리</label>
          <input name="distance" value={values.distance} onChange={onChange} />
        </div>
        <div className="row">
          <label>주행 거리별 금액(0~30km)</label>
          <input
            name="firstCost"
            value={values.firstCost}
            onChange={onChange}
          />
        </div>
        <div className="row">
          <label>주행 거리별 금액(30~100km)</label>
          <input
            name="secondCost"
            value={values.secondCost}
            onChange={onChange}
          />
        </div>
        <div className="row">
          <label>주행 거리별 금액(100km ~)</label>
          <input
            name="thirdCost"
            value={values.thirdCost}
            onChange={onChange}
          />
        </div>
        <div className="row total">
          <label>총 예상 금액</label>
          <p className="cost">{`${totalCost.toLocaleString()} 원`}</p>
        </div>
        <div className="row button">
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
      {list.length > 0 && (
        <div className="result_container">
          {list.map((item, i) => (
            <div key={i} className="list">
              <span className="summary">
                {`${item.platform} / ${item.car} / ${item.period} / ${
                  item.distance
                }km 주행 / ${item.cost.toLocaleString()} 원`}
              </span>
              <button className="delete" onClick={() => handleClick(item.no)}>
                삭제
              </button>
            </div>
          ))}
          <div className="row button init">
            <button onClick={handleInit}>초기화</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rent;
