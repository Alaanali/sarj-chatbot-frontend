import React, { useState, useRef, useEffect } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Settings,
  Send,
  Loader,
  MapPin,
  Activity,
  Calendar,
  ChevronDown,
  ChevronRight,
  Code,
  Clock,
  CheckCircle2
} from 'lucide-react';

const WeatherChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-5-nano');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Weather icon helper
  const getWeatherIcon = (iconCode, description) => {
    const iconMap = {
      '01d': <Sun className="w-6 h-6 text-yellow-500" />,
      '01n': <Sun className="w-6 h-6 text-yellow-300" />,
      '02d': <Cloud className="w-6 h-6 text-gray-400" />,
      '02n': <Cloud className="w-6 h-6 text-gray-500" />,
      '03d': <Cloud className="w-6 h-6 text-gray-500" />,
      '03n': <Cloud className="w-6 h-6 text-gray-600" />,
      '04d': <Cloud className="w-6 h-6 text-gray-600" />,
      '04n': <Cloud className="w-6 h-6 text-gray-700" />,
      '09d': <CloudRain className="w-6 h-6 text-blue-500" />,
      '09n': <CloudRain className="w-6 h-6 text-blue-600" />,
      '10d': <CloudRain className="w-6 h-6 text-blue-500" />,
      '10n': <CloudRain className="w-6 h-6 text-blue-600" />,
      '11d': <CloudRain className="w-6 h-6 text-purple-500" />,
      '11n': <CloudRain className="w-6 h-6 text-purple-600" />,
      '13d': <CloudSnow className="w-6 h-6 text-blue-200" />,
      '13n': <CloudSnow className="w-6 h-6 text-blue-300" />,
      '50d': <Cloud className="w-6 h-6 text-gray-400" />,
      '50n': <Cloud className="w-6 h-6 text-gray-500" />
    };

    return iconMap[iconCode] || <Cloud className="w-6 h-6 text-gray-400" />;
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Single day forecast card
  const ForecastDayCard = ({ dayData, isFirst }) => (
    <div className={`${isFirst ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-700">
          {formatDate(dayData.date)}
        </div>
        {getWeatherIcon(dayData.icon, dayData.description)}
      </div>

      <div className="text-center mb-3">
        <div className="text-lg font-bold text-gray-800">
          {Math.round(dayData.high_temp)}°
        </div>
        <div className="text-sm text-gray-600">
          {Math.round(dayData.low_temp)}°
        </div>
      </div>

      <div className="text-xs text-gray-600 capitalize text-center mb-3">
        {dayData.description}
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-500" />
            <span>{dayData.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3 text-gray-500" />
            <span>{dayData.wind_speed}m/s</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Weather forecast component
  const WeatherForecast = ({ weatherData, city, executionTime }) => {
    if (weatherData.error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
          <div className="flex items-center gap-2 text-red-700">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{city}</span>
          </div>
          <p className="text-red-600 text-sm mt-2">{weatherData.error}</p>
        </div>
      );
    }

    const unitSymbol = weatherData.units === "imperial" ? "°F" : "°C";

    // Handle both current weather and forecast
    const isCurrentWeather = !weatherData.forecast;

    if (isCurrentWeather) {
      // Current weather card (existing logic)
      return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-lg text-gray-800">
                {weatherData.city}, {weatherData.country}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {getWeatherIcon(weatherData.icon, weatherData.description)}
              <span className="text-2xl font-bold text-gray-800">
                {weatherData.temperature}{unitSymbol}
              </span>
            </div>
          </div>

          <div className="text-gray-700 capitalize mb-3 text-center">
            {weatherData.description}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <div>
                <div className="text-gray-600">Feels like</div>
                <div className="font-medium">{weatherData.feels_like}{unitSymbol}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-gray-600">Humidity</div>
                <div className="font-medium">{weatherData.humidity}%</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-gray-600">Wind</div>
                <div className="font-medium">{weatherData.wind_speed} m/s</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-gray-600">Visibility</div>
                <div className="font-medium">{weatherData.visibility} km</div>
              </div>
            </div>
          </div>

          {executionTime && (
            <div className="text-xs text-gray-500 mt-3 text-right">
              Retrieved in {executionTime}ms
            </div>
          )}
        </div>
      );
    } else {
      // Forecast display
      return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-4 mb-3">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-lg text-gray-800">
              {weatherData.days_requested}-Day Forecast for {weatherData.city}, {weatherData.country}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {weatherData.forecast.map((dayData, index) => (
              <ForecastDayCard
                key={dayData.date}
                dayData={dayData}
                isFirst={index === 0}
              />
            ))}
          </div>

          {executionTime && (
            <div className="text-xs text-gray-500 mt-4 text-right">
              Retrieved in {executionTime}ms
            </div>
          )}
        </div>
      );
    }
  };

  // Tool call component with collapsible details
  const ToolCallComponent = ({ toolCall }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isCompleted = toolCall.status === 'completed';

    return (
      <div className="mb-3">
        {/* Tool Call Header */}
        <div
          className={`border rounded-lg transition-all duration-300 cursor-pointer ${isCompleted
            ? 'bg-green-50 border-green-200 hover:bg-green-100'
            : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
            }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Settings className="w-4 h-4 text-blue-600 animate-spin" />
                )}
                <span className={`font-medium text-sm ${isCompleted ? 'text-green-800' : 'text-blue-800'
                  }`}>
                  {toolCall.functionName}
                </span>
                {isCompleted && toolCall.executionTime && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {toolCall.executionTime}ms
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Quick preview of arguments */}
                <span className={`text-xs px-2 py-1 rounded ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                  {toolCall.arguments.city}
                  {toolCall.arguments.days && ` • ${toolCall.arguments.days} days`}
                </span>

                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </div>

            {!isCompleted && (
              <div className="mt-2">
                <div className="w-full bg-blue-200 rounded-full h-1">
                  <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Details */}
          {isExpanded && (
            <div className="border-t border-gray-200 p-3 bg-white/50">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Function Call Details</span>
              </div>

              <div className="bg-gray-50 rounded p-3 font-mono text-sm">
                <div className="text-purple-600 mb-1">
                  {toolCall.functionName}(
                </div>
                <div className="ml-4 text-gray-700">
                  {Object.entries(toolCall.arguments).map(([key, value], index, array) => (
                    <div key={key}>
                      <span className="text-blue-600">{key}</span>
                      <span className="text-gray-500">: </span>
                      <span className="text-green-600">"{value}"</span>
                      {index < array.length - 1 && <span className="text-gray-500">,</span>}
                    </div>
                  ))}
                </div>
                <div className="text-purple-600">)</div>
              </div>

              {isCompleted && (
                <div className="mt-2 text-xs text-gray-600">
                  ✅ Completed successfully in {toolCall.executionTime}ms
                </div>
              )}
            </div>
          )}
        </div>

        {/* Weather Data Result */}
        {isCompleted && toolCall.weatherData && (
          <div className="mt-2">
            <WeatherForecast
              weatherData={toolCall.weatherData}
              city={toolCall.arguments.city}
              executionTime={toolCall.executionTime}
            />
          </div>
        )}
      </div>
    );
  };

  // Message component
  const MessageBubble = ({ message, isUser }) => {
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-4xl ${isUser ? 'max-w-md' : 'w-full'}`}>
          {isUser ? (
            <div className="bg-blue-500 text-white px-4 py-3 rounded-lg">
              <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              {/* Tool calls */}
              {message.toolCalls && message.toolCalls.map((toolCall) => (
                <ToolCallComponent key={toolCall.id} toolCall={toolCall} />
              ))}

              {/* Assistant text */}
              {message.text && (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800">
                    {message.text}
                  </div>
                </div>
              )}

              {/* Streaming indicator */}
              {message.isStreaming && (
                <div className="flex items-center gap-2 mt-2">
                  <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                  <span className="text-blue-600 text-sm">Assistant is thinking...</span>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
                <span>{message.model || selectedModel}</span>
                {message.totalTime && (
                  <span>Total: {message.totalTime}ms</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Send message function with proper duplication fix
  const sendMessage = async () => {
    if (!currentInput.trim() || isStreaming) return;

    const userMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: currentInput,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsStreaming(true);

    // Create assistant message with unique ID
    const assistantMessageId = `assistant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const assistantMessage = {
      id: assistantMessageId,
      text: '',
      isUser: false,
      toolCalls: [],
      isStreaming: true,
      totalTime: null,
      model: selectedModel, // Store the model used for this message
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const response = await fetch('http://localhost:5000/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, model: selectedModel })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamCompleted = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'done' && !streamCompleted) {
              streamCompleted = true;
              setMessages(prev => {
                return prev.map(msg => {
                  if (msg.id === assistantMessageId) {
                    return {
                      ...msg,
                      isStreaming: false,
                      totalTime: data.total_time
                    };
                  }
                  return msg;
                });
              });
              break;
            }

            if (!streamCompleted) {
              setMessages(prev => {
                return prev.map(msg => {
                  if (msg.id === assistantMessageId) {
                    switch (data.type) {
                      case 'tool_call':
                        // Add new tool call with unique ID
                        const toolCallId = `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                        return {
                          ...msg,
                          toolCalls: [...msg.toolCalls, {
                            id: toolCallId,
                            status: 'calling',
                            functionName: data.function_name,
                            arguments: data.arguments
                          }]
                        };

                      case 'weather_data': {
                        // Update the most recent tool call
                        const toolCallIndex = msg.toolCalls.length - 1;
                        if (toolCallIndex >= 0) {
                          const updatedToolCalls = [...msg.toolCalls];
                          updatedToolCalls[toolCallIndex] = {
                            ...updatedToolCalls[toolCallIndex],
                            status: 'completed',
                            weatherData: data.data,
                            executionTime: data.execution_time
                          };
                          return {
                            ...msg,
                            toolCalls: updatedToolCalls
                          };
                        }
                        return msg;
                      }

                      case 'text_delta':
                        return {
                          ...msg,
                          text: msg.text + data.delta
                        };

                      case 'error':
                        return {
                          ...msg,
                          text: `Error: ${data.message}`,
                          isStreaming: false
                        };

                      default:
                        return msg;
                    }
                  }
                  return msg;
                });
              });
            }
          } catch (e) {
            console.error('Parse error:', e, 'Line:', line);
          }
        }

        if (streamCompleted) break;
      }
    } catch (error) {
      console.error('Streaming error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          text: `Connection error: ${error.message}`,
          isUser: false,
          toolCalls: [],
          totalTime: null,
          model: selectedModel
        }
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Weather Assistant</h1>
            <p className="text-sm text-gray-600">Ask about weather conditions anywhere in the world</p>
          </div>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isStreaming}
          >
            <option value="gpt-5-nano">GPT-5 Nano</option>
            <option value="gemini-2.0-flash-lite">Gemini-2.0 Flash Lite</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Cloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">Welcome to Weather Assistant</p>
            <p className="text-sm">Ask me about current weather or forecasts for any city!</p>
            <div className="mt-4 text-xs text-gray-400">
              Try: "What's the weather in London?" or "5-day forecast for Paris"
            </div>
          </div>
        )}

        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} isUser={msg.isUser} />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about weather (e.g., 'Weather in Paris', '5-day forecast for Tokyo')..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
            disabled={isStreaming}
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !currentInput.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isStreaming ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isStreaming ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherChatComponent;