import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useMyContext } from "../../../../Context/MyContextProvider";
import axios from "axios";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import LiveUserListing from "./LiveUserListing";
import PushNotificationButton from "./components/PushNotificationButton.jsx";
import EventNotification from "./EventNotification";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const LiveUsers = () => {
  const [users, setUsers] = useState([]);
  const { api, authToken } = useMyContext();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("");
  const [chartData, setChartData] = useState({
    devices: { labels: [], datasets: [] },
    platforms: { labels: [], datasets: [] },
    browsers: { labels: [], datasets: [] },
  });

  const colors = {
    devices: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
    platforms: ["#36A2EB", "#FF6384", "#FFCE56"],
    browsers: ["#4BC0C0", "#9966FF", "#FF6384", "#36A2EB"],
  };

  useEffect(() => {
    const fetchLiveUsers = async () => {
      setLoading(true);
      try {
        const queryParams = dateRange ? `?date=${dateRange}` : "";
        const url = `${api}live-user${queryParams}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUsers(response.data.data.reverse());

        const stats = {
          devices: {},
          platforms: {},
          browsers: {},
        };
        const locations = {
          cities: {},
          states: {},
        };
        response.data.data.forEach((user) => {
          stats.devices[user.device] = (stats.devices[user.device] || 0) + 1;
          stats.platforms[user.platform] =
            (stats.platforms[user.platform] || 0) + 1;
          stats.browsers[user.browser] =
            (stats.browsers[user.browser] || 0) + 1;

          // Location stats
          if (user.locality) {
            locations.cities[user.locality] =
              (locations.cities[user.locality] || 0) + 1;
          }
          if (user.state) {
            locations.states[user.state] =
              (locations.states[user.state] || 0) + 1;
          }
        });
        setChartData({
          devices: {
            labels: Object.keys(stats.devices),
            datasets: [
              {
                data: Object.values(stats.devices),
                backgroundColor: colors.devices,
                borderWidth: 1,
              },
            ],
          },
          platforms: {
            labels: Object.keys(stats.platforms),
            datasets: [
              {
                label: "Platform Distribution",
                data: Object.values(stats.platforms),
                backgroundColor: colors.platforms,
                borderColor: colors.platforms,
                borderWidth: 1,
              },
            ],
          },
          browsers: {
            labels: Object.keys(stats.browsers),
            datasets: [
              {
                label: "Browser Usage",
                data: Object.values(stats.browsers),
                backgroundColor: colors.browsers[0],
                borderColor: colors.browsers[1],
                borderWidth: 2,
                tension: 0.4,
              },
            ],
          },
        });
      } catch (error) {
        console.error("Error fetching live users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveUsers();
  }, [api, authToken, dateRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="live-users-container">
      <Row className="g-3">
        <Col lg={4}>
          <Card className="h-100">
            <Card.Body>
              <h6 className="text-center mb-4">Device Distribution</h6>
              <div style={{ height: "300px" }}>
                <Doughnut
                  data={chartData.devices}
                  options={{
                    ...options,
                    plugins: {
                      ...options.plugins,
                      title: { ...options.plugins.title, text: "Devices" },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="h-100">
            <Card.Body>
              <h6 className="text-center mb-4">Platform Stats</h6>
              <div style={{ height: "300px" }}>
                <Bar
                  data={chartData.platforms}
                  options={{
                    ...options,
                    plugins: {
                      ...options.plugins,
                      title: { ...options.plugins.title, text: "Platforms" },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="h-100">
            <Card.Body>
              <h6 className="text-center mb-4">Browser Trends</h6>
              <div style={{ height: "300px" }}>
                <Line
                  data={chartData.browsers}
                  options={{
                    ...options,
                    plugins: {
                      ...options.plugins,
                      title: { ...options.plugins.title, text: "Browsers" },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-4">
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Total Active Users: {users?.length}</h6>
              <div className="d-flex gap-2">
                <EventNotification />
                <PushNotificationButton />
              </div>
            </div>
            <div className="d-flex gap-3">
              {Object.entries(chartData.devices.labels).map((device, index) => (
                <div key={index} className="text-center">
                  <div
                    className="h5 mb-0"
                    style={{ color: colors.devices[index] }}
                  >
                    {chartData.devices.datasets[0].data[index]}
                  </div>
                  <small>{device[1]}</small>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      <LiveUserListing
        data={users}
        loading={loading}
        setDateRange={setDateRange}
        dateRange={dateRange}
      />
    </div>
  );
};

export default LiveUsers;
