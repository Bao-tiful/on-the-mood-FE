import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useInfiniteThreads } from "@/src/hooks/useInfiniteThreads";
import ThreadItem from "./ThreadItem";
import { router } from "expo-router";
import typography from "@/src/styles/Typography";
import { Colors } from "@/src/styles/Colors";
import { Thread } from "@/src/types/thread";

interface ThreadsProps {
  updateDate: (date: Date) => void;
}

export default function Threads({ updateDate }: ThreadsProps) {
  const { threads, isLoading, error, hasMore, loadMore, refresh } =
    useInfiniteThreads({ pageSize: 10 });

  const sections = useMemo(() => {
    return Object.entries(threads).map(([date, items]) => {
      const [year, month] = date.split("-");
      const formattedDate = `${year}.${month.padStart(2, "0")}`;
      return {
        title: formattedDate,
        data: items,
      };
    });
  }, [threads]);

  const onEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      loadMore();
    }
  }, [isLoading, hasMore, loadMore]);

  const renderFooter = useCallback(() => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" />
      </View>
    );
  }, [isLoading]);

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    ),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: Thread }) => <ThreadItem thread={item} />,
    []
  );

  const handleEditPress = useCallback(() => {
    router.push("/pages/EditPage");
  }, []);

  const renderEmptyState = useCallback(() => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>아직 기록한 일기가 없어요.</Text>
        <Text style={styles.emptySubtitle}>오늘을 기록하러 가볼까요?</Text>
        <TouchableOpacity style={styles.emptyButton} onPress={handleEditPress}>
          <Text style={styles.emptyButtonText}>기록하기</Text>
        </TouchableOpacity>
      </View>
    );
  }, [isLoading, handleEditPress]);

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          스레드 로딩 중 오류가 발생했습니다
        </Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (sections.length === 0) {
    return <View style={styles.container}>{renderEmptyState()}</View>;
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} />
        }
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={true}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingTop: 10,
  },
  listContent: {
    flexGrow: 1,
  },
  footerContainer: {
    paddingVertical: 20,
  },
  sectionHeader: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    ...typography.headline,
    marginBottom: 8,
    color: Colors.black100,
  },
  emptySubtitle: {
    ...typography.body,
    marginBottom: 24,
    color: Colors.black40,
  },
  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 66,
    backgroundColor: Colors.black100,
    borderRadius: 50,
  },
  emptyButtonText: {
    ...typography.body,
    color: Colors.lightGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorTitle: {
    color: "red",
    marginBottom: 10,
  },
  errorMessage: {
    color: "gray",
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
  },
});
