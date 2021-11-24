/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { scopeMap } from "../shared/scopeMap";

const Vehicle = ({ scope }: any): JSX.Element => {
  const [validScopeAttributes, setValidScopeAttributes] = useState<any[]>([]);

  useEffect(() => {
    const scopeData = localStorage.getItem(scope);
    if (scopeData) {
      setValidScopeAttributes(JSON.parse(scopeData));
    };
  }, []);

  useEffect(() => {
    const fetchScopeAttributes = async () => {
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/${scopeMap[scope].url}`);
      const { meta, id, ...attributes } = response.data;

      setValidScopeAttributes([
        scope,
        attributes
      ]);
    };

    validScopeAttributes.length === 0 && fetchScopeAttributes();

    validScopeAttributes.length > 0 && localStorage.setItem(scope, JSON.stringify(validScopeAttributes));
  }, []);

  const renderAttributes = (attribute: Record<string, string | number | boolean>) => {
    let attributeList: JSX.Element[] = [];

    for (const [key, value] of Object.entries(attribute)) {
      attributeList.push(
        <span>{scopeMap[key].name}: {value.toString()}</span>
      );
    }

    return attributeList;
  };

  const scopeName = validScopeAttributes[0];
  const scopeAttributes = validScopeAttributes[1];

  return (
    <section className="scope-attribute">
      {scopeName && <h2>{scopeMap[scopeName].name}</h2>}
      {scopeName && <div>{renderAttributes(scopeAttributes)}</div>}
    </section>
  );
};

export default Vehicle;
