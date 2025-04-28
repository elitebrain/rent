"use client";
import React, { useCallback, useEffect, useState } from "react";

const Rent = () => {
  const [values, setValues] = useState<{
    no: number;
    platform: string;
    car: string;
    period: string;
    rent: string;
    insuranceFee: string;
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
    insuranceFee: "",
    distance: "",
    firstCost: "",
    secondCost: "",
    thirdCost: "",
  });
  const [totalCost, setTotalCost] = useState<number>(0);
  const [drivingCharge, setDrivingCharge] = useState<number>(0);
  const [list, setList] = useState<
    {
      no: number;
      platform: string;
      car: string;
      rent: number;
      insuranceFee: number;
      period: string;
      distance: string;
      drivingCharge: number;
      cost: number;
    }[]
  >([]);
  const [detailViewIdx, setDetaiViewIdx] = useState<number>(-1);

  /**
   * 렌트비용, 주행거리, 주행거리별 금액으로 총 예상금액 계산
   * @param rent number
   * @param insuranceFee number
   * @param distance number
   * @param firstCost number
   * @param secondCost number
   * @param thirdCost number
   * @returns
   */
  const calculate = (
    rent: number,
    insuranceFee: number,
    distance: number,
    firstCost: number,
    secondCost: number,
    thirdCost: number
  ): number => {
    let drivingCharge = 0;
    if (distance <= 30) {
      drivingCharge = distance * firstCost;
    } else if (distance <= 100) {
      drivingCharge = 30 * firstCost + (distance - 30) * secondCost;
    } else {
      drivingCharge =
        30 * firstCost + 70 * secondCost + (distance - 100) * thirdCost;
    }
    return { cost: rent + insuranceFee + drivingCharge, drivingCharge };
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
    const insuranceFee = Number(values.insuranceFee);
    const distance = Number(values.distance);
    const firstCost = Number(values.firstCost);
    const secondCost = Number(values.secondCost);
    const thirdCost = Number(values.thirdCost);
    const { cost, drivingCharge } = calculate(
      rent,
      insuranceFee,
      distance,
      firstCost,
      secondCost,
      thirdCost
    );
    setTotalCost(cost);
    setDrivingCharge(drivingCharge);
  }, [values]);

  console.log("list", list);
  /**
   * 저장
   */
  const handleSave = useCallback(() => {
    if (
      values.car === "" ||
      values.rent === "" ||
      values.insuranceFee === "" ||
      values.period === "" ||
      values.distance === "" ||
      values.firstCost === "" ||
      values.secondCost === "" ||
      values.thirdCost === ""
    ) {
      return alert("차종, 렌트비용, 주행거리 및 금액을 입력하세요.");
    }
    const rent = Number(values.rent);
    const insuranceFee = Number(values.insuranceFee);
    // local storage에 목록 저장
    localStorage.setItem(
      "rentList",
      JSON.stringify([
        ...list,
        {
          no: list.length > 0 ? list[list.length - 1].no + 1 : 1,
          platform: values.platform,
          car: values.car,
          rent,
          insuranceFee,
          period: values.period,
          distance: values.distance,
          drivingCharge,
          cost: totalCost,
        },
      ])
    );
    // list 업데이트
    setList((prevList) => [
      ...prevList,
      {
        no: prevList.length > 0 ? prevList[prevList.length - 1].no + 1 : 1,
        platform: values.platform,
        car: values.car,
        rent,
        insuranceFee,
        period: values.period,
        distance: values.distance,
        drivingCharge,
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
  }, [values, totalCost, list, drivingCharge]);

  useEffect(() => {
    console.log("localStorage");
    if (localStorage) {
      const rentListStr = localStorage.getItem("rentList");
      const list = rentListStr ? JSON.parse(rentListStr) : [];
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

  /**
   * 상세 내역 확인
   * @param idx
   */
  const handleDetailView = (idx: number) => {
    setDetaiViewIdx((prevIdx) => {
      if (prevIdx === idx) {
        return -1;
      } else {
        return idx;
      }
    });
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
          <label>보험료</label>
          <input
            name="insuranceFee"
            value={values.insuranceFee}
            onChange={onChange}
          />
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
              <span className="summary" onClick={() => handleDetailView(i)}>
                {`${item.platform} / ${item.car} / ${item.period} / ${
                  item.distance
                }km 주행 / ${item.cost.toLocaleString()} 원`}
              </span>
              <button className="delete" onClick={() => handleClick(item.no)}>
                삭제
              </button>
              {detailViewIdx === i && (
                <div className="detail-container">
                  <div className="flex justify-between">
                    <label>플랫폼</label>
                    <p>{item.platform}</p>
                  </div>
                  <div className="flex justify-between">
                    <label>차종</label>
                    <p>{item.car}</p>
                  </div>
                  <div className="flex justify-between">
                    <label>이용 기간</label>
                    <p>{item.period}</p>
                  </div>
                  <div className="flex justify-between">
                    <label>예상 주행 거리</label>
                    <p>{item.distance}km</p>
                  </div>
                  <div className="flex justify-between">
                    <label>렌트 비용</label>
                    <p>{item.rent.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <label>보험료</label>
                    <p>{item.insuranceFee.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <label>주행 요금</label>
                    <p>{item.drivingCharge.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <label>총 예상 비용</label>
                    <p>{item.cost.toLocaleString()}</p>
                  </div>
                </div>
              )}
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
