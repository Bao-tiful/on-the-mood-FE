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
import {
  useThreadsSections,
  ThreadSection,
} from "@/src/hooks/useThreadsSections";

interface ThreadsProps {
  updateDate: (date: Date) => void;
}

// 빈 상태 컴포넌트 분리
const EmptyState = React.memo(({ onPress }: { onPress: () => void }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyTitle}>아직 기록한 일기가 없어요.</Text>
    <Text style={styles.emptySubtitle}>오늘을 기록하러 가볼까요?</Text>
    <TouchableOpacity
      style={styles.emptyButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="일기 기록하러 가기"
    >
      <Text style={styles.emptyButtonText}>기록하기</Text>
    </TouchableOpacity>
  </View>
));

// 에러 상태 컴포넌트 분리
const ErrorState = React.memo(
  ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
    <SafeAreaView style={styles.errorContainer}>
      <Text style={styles.errorTitle}>스레드 로딩 중 오류가 발생했습니다</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="다시 시도"
      >
        <Text style={styles.retryButtonText}>다시 시도</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
);

// 로딩 인디케이터 컴포넌트 분리
const LoadingFooter = React.memo(() => (
  <View style={styles.footerContainer}>
    <ActivityIndicator size="small" color={Colors.black40} />
  </View>
));

// 섹션 헤더 컴포넌트 분리
const SectionHeader = React.memo(({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
));

export default function Threads({ updateDate }: ThreadsProps) {
  const { threads, isLoading, error, hasMore, loadMore, refresh } =
    useInfiniteThreads({ pageSize: 10 });

  const sections = useThreadsSections(threads);

  const handleEditPress = useCallback(() => {
    router.push("/pages/EditPage");
  }, []);

  const onEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      loadMore();
    }
  }, [isLoading, hasMore, loadMore]);

  const renderFooter = useCallback(() => {
    if (!isLoading) return null;
    return <LoadingFooter />;
  }, [isLoading]);

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => (
      <SectionHeader title={title} />
    ),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: Thread }) => <ThreadItem thread={item} />,
    []
  );

  const renderEmptyState = useCallback(() => {
    if (isLoading) return null;
    return <EmptyState onPress={handleEditPress} />;
  }, [isLoading, handleEditPress]);

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isLoading} onRefresh={refresh} />,
    [isLoading, refresh]
  );

  if (error) {
    return <ErrorState error={error} onRetry={refresh} />;
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
        refreshControl={refreshControl}
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
    alignItems: "center",
  },
  sectionHeader: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    ...typography.heading2,
    color: Colors.black100,
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
    textAlign: "center",
  },
  emptySubtitle: {
    ...typography.body,
    marginBottom: 24,
    color: Colors.black40,
    textAlign: "center",
  },
  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 66,
    backgroundColor: Colors.black100,
    borderRadius: 50,
    elevation: 2,
    shadowColor: Colors.black100,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyButtonText: {
    ...typography.body,
    color: Colors.lightGray,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorTitle: {
    ...typography.heading1,
    fontSize: 18,
    color: "#FF3B30",
    marginBottom: 10,
    textAlign: "center",
  },
  errorMessage: {
    ...typography.body2,
    color: Colors.black40,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    ...typography.body,
    color: "white",
    fontWeight: "600",
  },
});
