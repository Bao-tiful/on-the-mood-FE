import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useInfiniteThreads } from "@/src/hooks/useInfiniteThreads";
import ThreadItem from "./ThreadItem";

interface ThreadsProps {
  updateDate: (date: Date) => void;
}

export default function Threads({ updateDate }: ThreadsProps) {
  const { threads, isLoading, error, hasMore, loadMore, refresh } =
    useInfiniteThreads({ pageSize: 10 });

  const sections = Object.entries(threads).map(([date, items]) => {
    const [year, month] = date.split("-");
    const formattedDate = `${year}.${month.padStart(2, "0")}`;
    return {
      title: formattedDate,
      data: items,
    };
  });

  const onEndReached = () => {
    if (!isLoading && hasMore) {
      loadMore();
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: "red", marginBottom: 10 }}>
          스레드 로딩 중 오류가 발생했습니다
        </Text>
        <Text style={{ color: "gray" }}>{error.message}</Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#007AFF",
            borderRadius: 5,
          }}
          onPress={refresh}
        >
          <Text style={{ color: "white" }}>다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SectionList
        sections={sections}
        renderItem={({ item }) => <ThreadItem thread={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={{
              paddingBottom: 16,
              paddingHorizontal: 16,
              // backgroundColor: "white",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 24, lineHeight: 24 }}>
              {title}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} />
        }
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={true}
        style={{ flex: 1, paddingTop: 10 }}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}
