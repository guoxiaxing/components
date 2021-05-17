const inquirer = require("inquirer");
const mkdirp = require("mkdirp");
const {
  createTsx,
  createService,
  addExportInfo,
  createMdx
} = require("./utils/generate");

inquirer
  .prompt([
    {
      type: "list",
      name: "type",
      message: "1. 请选择你要生成的文件类型",
      choices: [
        {
          name: "component",
          value: "component"
        },
        {
          name: "doc",
          value: "document"
        },
        {
          name: "service",
          value: "service"
        }
      ],
      default: 0
    },
    {
      type: "input",
      name: "name",
      message: "2. 请输入文件名",
      validate: name => {
        if (name.length) {
          return true;
        }
        return "此输入不能为空";
      },
      default: "demo"
    },
    {
      type: "input",
      name: "path",
      message:
        "3. 请输入生成文件所在的路径(component：src/components/*, doc：pages/dir/*)",
      validate: path => {
        if (path.length) {
          return true;
        }
        return "此输入不能为空";
      },
      when: answers => {
        if (answers) {
          // answers 会拿到当前所有问题的答案 （answers.type 也就是 文件类型选择的不是 service时）
          // 当watch为true的时候才会提问当前问题
          return answers.type !== "service";
        }
      },
      default: ""
    },
    {
      type: "list",
      name: "isCreateDoc",
      message: "4. 是否需要添加对应的文档组件",
      choices: [
        {
          name: "添加",
          value: true
        },
        {
          name: "不添加",
          value: false
        }
      ],
      when: answers => {
        if (answers.type === "component") {
          return true;
        }
      },
      default: false
    }
  ])
  .then(async ({ type, name, path, isCreateDoc }) => {
    switch (type) {
      case "component": {
        const dirPath = __dirname.replace(
          "cli",
          `src/components/${path ? path : ""}${name}`
        );
        const docDirPath = __dirname.replace(
          "cli",
          `pages/dir/${path ? path : ""}${name}`
        );
        await generateComponent(dirPath, name);
        if (isCreateDoc) {
          await generateDocument(docDirPath, name);
        }
        break;
      }
      case "document": {
        // 生成文件夹地址
        const dirPath = __dirname.replace(
          "cli",
          `pages/dir/${path ? `${path}/` : ""}${name}`
        );
        await generateDocument(dirPath, name);
        break;
      }
      case "service": {
        await generateService(name);
      }
    }
  })
  .catch(e => {
    console.error(e);
  });

// 生成组件
async function generateComponent(dirPath, name) {
  // 生成的 tsx 文件地址
  const filePath = `${dirPath}/${name}.tsx`;
  const tplPath = `${__dirname}/templates/component-templates/tsx.template`;
  // 生成文件夹
  console.info(dirPath);
  console.log(__dirname);
  mkdirp(dirPath).then(
    () => {
      const createSourceList = [
        // 生成 tsx 文件
        createTsx(filePath, tplPath, name),
        // 生成 export 信息
        addExportInfo(
          __dirname.replace("cli", "src/components/index.ts"),
          filePath.replace(/.+components\/(.+)\.tsx/, "$1")
        )
      ];
      Promise.all(createSourceList).catch(createError => {
        console.error(createError);
      });
    },
    err => {
      console.error(err);
      process.exit();
    }
  );
}

// 生成文档 demo.tsx  index$.mdx
async function generateDocument(dirPath, name) {
  // 生成文件夹
  await mkdirp(dirPath).then(
    () => {
      const filePath = `${dirPath}/demo.tsx`;
      const tplPath = `${__dirname}/templates/document-templates/tsx.template`;
      const mdxPath = `${dirPath}/index$.mdx`;
      const mdxTplPath = `${__dirname}/templates/document-templates/mdx.template`;
      const createSourceList = [
        // 生成 tsx 文件
        createTsx(filePath, tplPath, name),
        // 生成 mdx 文件
        createMdx(mdxPath, mdxTplPath, name)
      ];

      Promise.all(createSourceList).catch(createError => {
        console.error(createError);
      });
    },
    err => {
      console.error(err);
      process.exit();
    }
  );
}

async function generateService(name) {
  // 生成文件夹
  try {
    await mkdirp(__dirname.replace("cli", "src/service"));
    const filePath = __dirname.replace("cli", `src/service/${name}.service.ts`);
    const tplPath = `${__dirname}/templates/service-templates/service.template`;
    await createService(filePath, tplPath, name).catch(createError => {
      console.error(createError);
    });
  } catch (e) {
    console.error(err);
    process.exit();
  }
}
