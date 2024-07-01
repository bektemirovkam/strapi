import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";

import { Spin, Card } from "antd";
import Meta from "antd/es/card/Meta";

interface Promotion {
  name: string;
  description: string;
  slug: string;
  subtitle: string;
  banner: {
    data: {
      attributes: Media;
    };
  };
}

interface Media {
  url: string;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState<{ attributes: Promotion }[]>([]);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:1337/api/promotions?populate=banner",
        {
          headers: {
            Authorization:
              "bearer 153567d2a28dc3d07776fb28f578a23437f2875e5b77a85ef71b6e18d04e94b801773bf0173ac5b244cae34abab64cbebe4ffcc7a1c23743a2e9a1a793b00c8748b880cbbb809dcf0b0c550b73e2fda86f2541bdf0febcd29b36cd8df4f2f65f941cad0109df3796d1fd85fee58565efe754699de5051a805c7a285759ba0acc",
          },
        },
      );

      return setPromotions(data.data);
    } catch (error) {
      console.log("error ===> ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 20,
        justifyContent: "center",
      }}
    >
      {promotions.map(({ attributes }) => {
        return (
          <Card
            hoverable
            style={{ width: 240 }}
            cover={
              <img
                alt="example"
                src={`http://localhost:1337${attributes.banner.data.attributes.url}`}
              />
            }
            key={attributes.slug}
          >
            <Meta title={attributes.name} description={attributes.subtitle} />
          </Card>
        );
      })}
    </div>
  );
}

export default App;
