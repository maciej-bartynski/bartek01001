class AsyncTasksQueue {
    private queue: Array<{
        task: () => Promise<any>;
        resolve: (value: any) => void;
        reject: (error: any) => void;
    }> = [];
    private processing = false;

    async enqueue<T>(task: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.process().catch(error => {
                console.error('AsyncQueue process error:', error);
            });
        });
    }

    private async process() {
        if (this.processing) return;

        this.processing = true;

        try {
            while (this.queue.length > 0) {
                const item = this.queue.shift();
                if (item) {
                    try {
                        const result = await item.task();
                        item.resolve(result);
                    } catch (error) {
                        item.reject(error);
                    }
                }
            }
        } finally {
            this.processing = false;
        }
    }
}

export default AsyncTasksQueue;