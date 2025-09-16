import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';

interface Transcript {
  text: string;
  start: number;
  end: number;
  speaker: string;
  speaker_id: string;
  confidence: number;
  chunk_sequence: number;
  absolute_timestamp: number;
}

interface Conversation {
  audio_uuid: string;
  audio_path: string;
  timestamp: number;
  transcript: Transcript[];
  speakers_identified: string[];
  cropped_audio_path?: string;
  speech_segments?: any;
  cropped_duration?: number;
  memories: Array<{
    memory_id: string;
    created_at: string;
    status: string;
    updated_at: string;
  }>;
  has_memory: boolean;
}

interface ConversationsResponse {
  conversations: Record<string, Conversation[]>;
}

interface TranscriptionsSectionProps {
  jwtToken: string | null;
  backendUrl: string;
}

const TranscriptionsSection: React.FC<TranscriptionsSectionProps> = ({ jwtToken, backendUrl }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getApiUrl = (endpoint: string) => {
    let baseUrl = backendUrl;
    if (baseUrl.startsWith('ws://')) {
      baseUrl = baseUrl.replace('ws://', 'http://');
    } else if (baseUrl.startsWith('wss://')) {
      baseUrl = baseUrl.replace('wss://', 'https://');
    }
    
    // Remove WebSocket endpoints
    baseUrl = baseUrl.replace(/\/ws_?.*$/, '');
    
    return `${baseUrl}${endpoint}`;
  };

  const fetchConversations = async () => {
    if (!jwtToken) {
      console.log('[TranscriptionsSection] No JWT token available');
      return;
    }

    try {
      setLoading(true);
      const url = getApiUrl('/api/conversations');
      console.log('[TranscriptionsSection] Fetching conversations from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ConversationsResponse = await response.json();
      console.log('[TranscriptionsSection] Received conversations:', data);
      
      // Flatten all conversations from all device groups and sort by timestamp (newest first)
      const allConversations: Conversation[] = [];
      Object.values(data.conversations).forEach(deviceConversations => {
        allConversations.push(...deviceConversations);
      });
      
      allConversations.sort((a, b) => b.timestamp - a.timestamp);
      setConversations(allConversations);
      
    } catch (error) {
      console.error('[TranscriptionsSection] Error fetching conversations:', error);
      Alert.alert('Error', `Failed to fetch conversations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jwtToken) {
      fetchConversations();
    }
  }, [jwtToken]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const formatDuration = (transcript: Transcript[]) => {
    if (transcript.length === 0) return '0s';
    const totalDuration = Math.max(...transcript.map(t => t.end));
    return totalDuration > 60 ? `${Math.floor(totalDuration / 60)}m ${Math.floor(totalDuration % 60)}s` : `${Math.floor(totalDuration)}s`;
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <View style={styles.conversationItem}>
      <View style={styles.conversationHeader}>
        <Text style={styles.conversationTime}>
          {formatTimestamp(item.timestamp)}
        </Text>
        <Text style={styles.conversationDuration}>
          {formatDuration(item.transcript)}
        </Text>
      </View>
      
      {item.transcript.length > 0 ? (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptText} numberOfLines={3}>
            {item.transcript.map(t => t.text).join(' ')}
          </Text>
        </View>
      ) : (
        <Text style={styles.noTranscriptText}>No transcript available</Text>
      )}
      
      <View style={styles.conversationFooter}>
        <Text style={styles.conversationId}>
          ID: {item.audio_uuid.substring(0, 8)}...
        </Text>
        {item.has_memory && (
          <View style={styles.memoryBadge}>
            <Text style={styles.memoryBadgeText}>✓ Memory</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (!jwtToken) {
    return (
      <View style={styles.container}>
        <Text style={styles.noAuthText}>
          Please log in to view transcriptions
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transcriptions</Text>
        <TouchableOpacity onPress={fetchConversations} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      
      {conversations.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No conversations yet. Try recording some audio!
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.audio_uuid}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  conversationItem: {
    backgroundColor: 'white',
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversationTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  conversationDuration: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  transcriptContainer: {
    marginBottom: 12,
  },
  transcriptText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  noTranscriptText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationId: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  memoryBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  memoryBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  noAuthText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default TranscriptionsSection;