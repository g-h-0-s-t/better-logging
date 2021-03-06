import safeStringify from "fast-safe-stringify";
import { Config } from "./config";
import { MessageConstructionStrategy } from "./enums/messageConstructionStrategy";
import { Color } from "./types/color";
import { LogType } from "./types/logType";

const constructFormattingContext = (
  logType: LogType,
  config: Config,
  message: string
) => {
  const typeColor = config.color.type[logType];
  const STAMP = (innerContent: string, innerColor?: Color) =>
    innerColor ? innerColor(innerContent) : config.color.base(innerContent);
  return {
    msg: STAMP(message, typeColor),
    type: STAMP(logType.toUpperCase()),
    time24: STAMP(
      new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      })
    ),
    time12: STAMP(
      new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      })
    ),
    date: STAMP(
      new Date().toLocaleString("en-GB", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
    ),
    unix: STAMP("" + new Date().valueOf()),
    STAMP: (content: string | number, color?: Color) =>
      STAMP(`${content}`, color),
  };
};

const constructMessage = (
  strategy: MessageConstructionStrategy,
  args: unknown[]
): [string, unknown[]] => {
  const processArgument = (arg: unknown): string => {
    if (typeof arg === "object") {
      return safeStringify(arg);
    }
    return `${arg}`;
  };

  if (strategy === MessageConstructionStrategy.NONE) {
    return ["", args];
  }
  if (strategy === MessageConstructionStrategy.FIRST) {
    const [first, ...rest] = args;
    return [processArgument(first), rest];
  }
  if (strategy === MessageConstructionStrategy.ALL) {
    return [args.map(processArgument).join(" "), []];
  }
  throw new Error(`Unknown MessageConstructionStrategy: ${strategy}`);
};

export const formatMessage = (
  logType: LogType,
  config: Config,
  args: unknown[]
): [string, unknown[]] => {
  const [rawMessage, remainingArgs] = constructMessage(
    config.messageConstructionStrategy,
    args
  );
  const formattingContext = constructFormattingContext(
    logType,
    config,
    rawMessage
  );
  const formattedMessage = config.format(formattingContext);
  return [formattedMessage, remainingArgs];
};
