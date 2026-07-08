import os


def find_and_merge_env(root_directory):
    # আপনার সিস্টেম বা সার্ভার স্টেশনের সব এনভায়রনমেন্ট ভেরিয়েবল ব্যাকআপ রাখা হচ্ছে
    system_envs = dict(os.environ)

    print("=" * 60)
    print(f"Searching for .env files in: {root_directory}")
    print("=" * 60 + "\n")

    # পুরো ডিরেক্টরি ট্রি স্ক্যান করা হচ্ছে
    for dirpath, _, filenames in os.walk(root_directory):
        if ".env" in filenames:
            env_file_path = os.path.join(dirpath, ".env")
            print(f"📂 Folder: {dirpath}")
            print(f"📄 File: {env_file_path}")
            print("-" * 40)

            # ফোল্ডারের নির্দিষ্ট .env ফাইলের ভেরিয়েবল পড়ার জন্য ডিকশনারি
            local_env = {}

            # .env ফাইলটি রিড করা হচ্ছে
            try:
                with open(env_file_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        # খালি লাইন বা কমেন্ট বাদ দেওয়া হচ্ছে
                        if not line or line.startswith("#"):
                            continue
                        if "=" in line:
                            key, value = line.split("=", 1)
                            local_env[key.strip()] = value.strip()
            except Exception as e:
                print(f"Error reading file: {e}")
                continue

            # সিস্টেম/সার্ভার ভেরিয়েবলগুলো এই ফোল্ডারের .env ভেরিয়েবলের সাথে মার্জ করা হচ্ছে
            # সিস্টেমের কোনো ভেরিয়েবল এখানে থাকলে সেটি যুক্ত হবে
            merged_env = {**local_env, **system_envs}

            # আউটপুট প্রিন্ট করা হচ্ছে
            for key, value in merged_env.items():
                # শুধু গুরুত্বপূর্ণ বা কাস্টম ভেরিয়েবল দেখতে চাইলে ফিল্টার করতে পারেন
                # এখানে সব ভেরিয়েবলই প্রিন্ট করে দেখানো হচ্ছে
                print(f"{key}={value}")

            print("\n" + "=" * 60 + "\n")


if __name__ == "__main__":
    # এখানে আপনার টার্গেট রুট ফোল্ডারের পাথ (Path) দিন
    # উদাহরণ: r"C:\Users\YourName\Projects" অথবা r"/home/user/projects"
    target_path = r"./"  # বর্তমানে যে ফোল্ডারে আছেন সেটি চেক করবে

    find_and_merge_env(target_path)
