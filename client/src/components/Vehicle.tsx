import { scopeMap } from "../shared/scopeMap";

const Vehicle = ({ scopeAttributes }: any): JSX.Element => { //TODO: fix type
  const renderAttributes = (attribute: Record<string, string>) => {
    let attributeList = [];

    for (const [key, value] of Object.entries(attribute)) {
      attributeList.push(
        <span>{scopeMap[key].name}: {value.toString()}</span>
      );
    }
    return attributeList;
  };

  return (
    <section className="scope-attribute">
      <h2>
        {scopeMap[scopeAttributes[0]].name}
      </h2>

      <div>
        {renderAttributes(scopeAttributes[1])}
      </div>
    </section>
  );
};

export default Vehicle;
