import { format } from "util";
import * as _ from "lodash";
import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import * as md5File from "md5-file";
import { logger } from "../utils/logger";
import { DB_WARP_SYNC_FILE_ENDING } from "../constants";

export function getFileHash(filename: string): string {
  return md5File.sync(filename);
}

export async function compressAndHashFile(dbFileName: string, networkId: string, dbVersion: number, syncfileTemplate: string, directoryDir: string = ".") {
  const WARP_SYNC_FILE = "__temp_sync_file__";
  await createWarpSyncFile(directoryDir, dbFileName, WARP_SYNC_FILE);
  const hash = getFileHash(path.join(directoryDir, WARP_SYNC_FILE));
  const syncFile = format(syncfileTemplate, hash, networkId, dbVersion);
  fs.renameSync(path.join(directoryDir, WARP_SYNC_FILE), path.join(directoryDir, syncFile));
  logger.info(format("create warp sync file %s", syncFile));
}

export async function restoreWarpSyncFile(directoryDir: string, dbFileName: string, syncFilenameAbsPath: string): Promise<void> {
  logger.info(format("restore/import warp sync file %s", syncFilenameAbsPath));
  return new Promise<void>((resolve, reject) => {
    const bigger = zlib.createGunzip();
    const input = fs.createReadStream(syncFilenameAbsPath);
    const output = fs.createWriteStream(path.join(directoryDir, dbFileName));

    input
      .pipe(bigger)
      .pipe(output)
      .on("error", (err: any) => {
        logger.error("Error: restoring warp sync file");
        reject(err);
      })
      .on("finish", () => {
        resolve();
      });
  });
}

export async function createWarpSyncFile(directoryDir: string, dbFileName: string, syncFilename: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const smaller = zlib.createGzip({ level: 9 });
    const input = fs.createReadStream(path.join(directoryDir, dbFileName));
    const output = fs.createWriteStream(path.join(directoryDir, syncFilename));

    input
      .pipe(smaller)
      .pipe(output)
      .on("error", (err: any) => {
        logger.error("Error: creating warp sync file");
        reject(err);
      })
      .on("finish", () => {
        resolve();
      });
  });
}

export function removeOldSyncFiles(networkId: string, dbVersion: number, directoryDir: string = ".") {
  const syncFiles = format(DB_WARP_SYNC_FILE_ENDING, networkId, dbVersion);
  const files = fs.readdirSync(directoryDir).filter((fn: string) => fn.endsWith(syncFiles));
  if (files) {
    _.each(files, (file) => fs.unlinkSync(path.join(directoryDir, file)));
  }
}

export function fileCompatible(filename: string, networkId: string, dbVersion: number): boolean {
  const compSyncfile = format(DB_WARP_SYNC_FILE_ENDING, networkId, dbVersion);
  return filename.endsWith(compSyncfile);
}
