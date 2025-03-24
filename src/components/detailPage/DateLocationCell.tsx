import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";
import { toDateString } from "@/src/utils/dateUtils";
import { View, Text } from "react-native";
import Icon, { IconName } from "../Icon";

const DateLocationCell = ({
  createdAt,
  location,
}: {
  createdAt: Date;
  location: string;
}) => (
  <View style={{ flex: 1, gap: 4 }}>
    <Text style={[typography.heading1, { color: Colors.black100 }]}>
      {toDateString(createdAt)}
    </Text>

    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      <Icon name={IconName.location} size={14} />
      <Text style={[typography.label1, { color: Colors.black100 }]}>
        {location}
      </Text>
    </View>
  </View>
);

export default DateLocationCell;
