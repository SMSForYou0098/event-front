import Card from "../../../components/bootstrap/card";
export default function ShimmerComponent() {
  
  return (
    <Card className="iq-product-custom-card">
      <Card.Body>
        <div className="d-flex justify-content-evenly">
          <div style={{ width: 350 }}>
            <p style={{ backgroundColor: "gray", height: 180, width: 330}}>
            </p>
          </div>
          <div style={{ width: 430 }}>
            <p style={{ backgroundColor: "gray", height: 20, width: 410 }}> </p>
            <p style={{ backgroundColor: "gray", height: 20, width: 410 }}> </p>
            <div>
              <p style={{ backgroundColor: "gray", height: 13, width: 320 }}>
              </p>
            </div>
            <ul>
              <p style={{ backgroundColor: "gray", height: 15, width: 200 }}>
              </p>
              <p style={{ backgroundColor: "gray", height: 15, width: 200 }}>
              </p>
              <p style={{ backgroundColor: "gray", height: 15, width: 200 }}>
              </p>
            </ul>
          </div>
          <div className="vr"></div>
          <div
            className="d-flex align-items-center flex-column"
            style={{ width: 120 }}
          >
            <p style={{ backgroundColor: "gray", height: 20, width: 70 }}> </p>
            <p style={{ backgroundColor: "gray", height: 10, width: 50 }}> </p>
            <p style={{ backgroundColor: "gray", height: 10, width: 80 }}> </p>
            <p style={{ backgroundColor: "gray", height: 40, width: 100 }}> </p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
