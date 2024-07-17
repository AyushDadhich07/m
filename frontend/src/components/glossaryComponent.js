import React, { useState, useMemo } from 'react';

const GlossaryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');


    const terms = [
        { term: "Biodiversity", definition: "The variety and variability of life on Earth, including diversity within species, between species, and of ecosystems." },
        { term: "Carbon Disclosure Project (CDP)", definition: "An organization that supports companies and cities to disclose the environmental impact of major corporations." },
        { term: "Carbon Footprint", definition: "The total amount of greenhouse gases, primarily carbon dioxide, emitted directly or indirectly by human activities." },
        { term: "Carbon Neutrality", definition: "Achieving net-zero carbon dioxide emissions by balancing carbon emissions with carbon removal or offsetting." },
        { term: "Carbon Offsetting", definition: "A way to compensate for emissions by funding an equivalent carbon dioxide saving elsewhere." },
        { term: "Circular Economy", definition: "An economic system aimed at minimizing waste and making the most of resources through reuse, recycling, and regeneration of products and materials." },
        { term: "Clean Technology", definition: "Products, services, and processes that use less energy, water, and raw materials, create less waste, and cause less environmental damage." },
        { term: "Climate Action", definition: "Efforts to reduce greenhouse gas emissions or enhance resilience to climate impacts." },
        { term: "Climate Adaptation", definition: "Adjustments in natural or human systems in response to actual or expected climatic stimuli or their effects." },
        { term: "Climate Change", definition: "Long-term alteration in global or regional climate patterns, attributed largely to human activity and the increase in greenhouse gas concentrations." },
        { term: "Climate Resilience", definition: "The ability to anticipate, prepare for, and respond to hazardous events, trends, or disturbances related to climate." },
        { term: "Climate Risk", definition: "The potential for negative outcomes resulting from climate change and its impacts." },
        { term: "Community Engagement", definition: "The process of working collaboratively with community groups to address issues affecting their well-being." },
        { term: "Corporate Citizenship", definition: "The extent to which businesses are socially responsible for meeting legal, ethical, and economic responsibilities placed on them by shareholders." },
        { term: "Corporate Ethics", definition: "The broad area dealing with the way in which a company approaches its moral and ethical responsibilities." },
        { term: "Corporate Governance", definition: "The system of rules, practices, and processes by which a company is directed and controlled." },
        { term: "Corporate Responsibility", definition: "The way a company takes into account the impact of its business activities on the world around it, including all stakeholders and the environment." },
        { term: "Corporate Social Responsibility (CSR)", definition: "A business approach that contributes to sustainable development by delivering economic, social, and environmental benefits for all stakeholders." },
        { term: "Corporate Sustainability", definition: "Business approach that creates long-term consumer and employee value by creating a \"green\" strategy aimed at the natural environment and taking into consideration every dimension of how a business operates." },
        { term: "CSR Reporting", definition: "The process of communicating the social and environmental effects of an organization's economic actions to particular interest groups within society and to society at large." },
        { term: "Decarbonization", definition: "The process of reducing carbon dioxide emissions from economic activities." },
        { term: "Diversity and Inclusion", definition: "Policies and practices that promote the representation and participation of different groups of individuals, including those of different ages, races, genders, abilities, and sexual orientations." },
        { term: "E-waste", definition: "Discarded electrical or electronic devices, often containing hazardous materials." },
        { term: "Eco-efficiency", definition: "The delivery of goods and services at competitive prices while reducing environmental impact and resource use." },
        { term: "Eco-friendly", definition: "Products or practices that do not harm the environment." },
        { term: "Eco-labeling", definition: "The practice of marking products with a distinctive label to show that their manufacture conforms to recognized environmental standards." },
        { term: "Ecological Footprint", definition: "A measure of human impact on Earth's ecosystems, typically expressed as the amount of land required to sustain their use of natural resources." },
        { term: "Emissions Trading", definition: "A market-based approach to controlling pollution by providing economic incentives for reducing the emissions of pollutants." },
        { term: "Energy Conservation", definition: "The effort made to reduce the consumption of energy by using less of an energy service." },
        { term: "Energy Efficiency", definition: "Using less energy to provide the same service or achieve the same outcome." },
        { term: "Energy Management", definition: "The proactive, organized, and systematic management of energy use in a building or organization to satisfy both environmental and economic requirements." },
        { term: "Environmental Impact", definition: "The effect of human activities on the environment, including natural resources, wildlife, and ecosystem health." },
        { term: "Environmental Impact Assessment (EIA)", definition: "The assessment of the environmental consequences of a plan, policy, program, or project before the decision to move forward with the proposed action." },
        { term: "Environmental Justice", definition: "The fair treatment and meaningful involvement of all people, regardless of race, color, national origin, or income, in environmental decision-making." },
        { term: "Environmental Management System (EMS)", definition: "A framework that helps an organization achieve its environmental goals through consistent control of its operations." },
        { term: "Environmental Policy", definition: "Commitments and actions taken by an organization to address its impact on the environment." },
        { term: "Environmental Stewardship", definition: "Responsible use and protection of the natural environment through conservation and sustainable practices." },
        { term: "ESG (Environmental, Social, Governance)", definition: "A set of criteria used to assess a company's performance in areas of environmental impact, social responsibility, and corporate governance practices." },
        { term: "Ethical Investing", definition: "The practice of using one's ethical principles as the primary filter for selecting securities." },
        { term: "Ethical Sourcing", definition: "Procuring goods and services in a manner that respects human rights, fair labor practices, and environmental considerations." },
        { term: "Fair Labor Practices", definition: "Practices that ensure fair wages, safe working conditions, and respect for workers' rights." },
        { term: "Fair Trade", definition: "Trade between companies in developed countries and producers in developing countries in which fair prices are paid to the producers." },
        { term: "Green Bonds", definition: "Bonds specifically earmarked to be used for climate and environmental projects." },
        { term: "Green Economy", definition: "An economy that aims at reducing environmental risks and ecological scarcities, and aims for sustainable development without degrading the environment." },
        { term: "Green Innovation", definition: "Innovation that results in significantly improved environmental performance." },
        { term: "Green Supply Chain", definition: "Integrating environmental thinking into supply chain management, including product design, material sourcing and selection, manufacturing processes, delivery of the final product, and end-of-life management." },
        { term: "Greenwashing", definition: "Disinformation disseminated by an organization to present an environmentally responsible public image that is not supported by its actions or products." },
        { term: "Human Rights", definition: "Rights inherent to all human beings, regardless of race, sex, nationality, ethnicity, language, religion, or any other status." },
        { term: "Impact Investing", definition: "Investments made with the intention to generate positive, measurable social and environmental impact alongside financial return." },
        { term: "Labor Standards", definition: "Norms and rules established to protect workers' rights and ensure fair, safe, and healthy working conditions." },
        { term: "Life Cycle Assessment (LCA)", definition: "A technique to assess the environmental aspects and potential impacts associated with a product, process, or service." },
        { term: "Materiality", definition: "The principle of defining the social and environmental topics that matter most to a business and its stakeholders." },
        { term: "Natural Capital", definition: "The world's stocks of natural assets which include geology, soil, air, water, and all living things." },
        { term: "Net Zero", definition: "Achieving a balance between the amount of greenhouse gas emissions produced and the amount removed from the atmosphere." },
        { term: "Non-Financial Reporting", definition: "Reporting that covers environmental, social, and governance (ESG) performance, rather than financial performance." },
        { term: "Pollution Prevention", definition: "Practices that reduce or eliminate the creation of pollutants." },
        { term: "Renewable Energy", definition: "Energy derived from sources that are naturally replenished on a human timescale, such as sunlight, wind, rain, tides, waves, and geothermal heat." },
        { term: "Renewable Energy Certificates (RECs)", definition: "Market-based instruments that represent the property rights to the environmental, social, and other non-power attributes of renewable electricity generation." },
        { term: "Renewable Energy Credits (RECs)", definition: "Certificates that represent proof that 1 megawatt-hour (MWh) of electricity was generated from an eligible renewable energy resource." },
        { term: "Renewable Energy Investment", definition: "Investment in renewable energy sources like wind, solar, hydroelectric, and biomass energy." },
        { term: "Renewable Resources", definition: "Natural resources that can be replenished naturally with the passage of time, such as sunlight, wind, and biomass." },
        { term: "Responsible Consumption", definition: "The use of products and services that have minimal impact on the environment so future generations can meet their needs." },
        { term: "Responsible Investment", definition: "An investment strategy that considers environmental, social, and governance (ESG) factors to generate sustainable, long-term financial returns and positive societal impact." },
        { term: "Social Accountability", definition: "The obligation of an organization to be answerable to all its stakeholders, not just shareholders." },
        { term: "Social Audit", definition: "A process of evaluating a firm's various operating procedures, code of conduct, and other factors to determine its effect on a society." },
        { term: "Social Enterprise", definition: "An organization that applies commercial strategies to maximize improvements in financial, social, and environmental well-being." },
        { term: "Social Equity", definition: "Fair distribution of resources, opportunities, and privileges within a society that ensures everyone has an equal chance to thrive." },
        { term: "Social Impact", definition: "The effect of an activity on the social fabric of the community and well-being of the individuals and families." },
        { term: "Social Sustainability", definition: "Creating an equitable, diverse, connected, and democratic society that provides a good quality of life." },
        { term: "Socially Responsible Investing (SRI)", definition: "Investing in companies that meet certain ethical, social, and environmental criteria." },
        { term: "Stakeholder", definition: "Individuals or groups who have an interest in or are affected by an organization's actions, decisions, or policies." },
        { term: "Stakeholder Engagement", definition: "The process by which an organization involves people who may be affected by the decisions it makes or can influence the implementation of its decisions." },
        { term: "Supply Chain Sustainability", definition: "The management of environmental, social, and economic impacts, and the encouragement of good governance practices, throughout the lifecycles of goods and services." },
        { term: "Sustainability", definition: "The ability to meet the needs of the present without compromising the ability of future generations to meet their own needs." },
        { term: "Sustainability Reporting", definition: "The practice of organizations disclosing information on their environmental, social, and governance (ESG) performance." },
        { term: "Sustainability Strategy", definition: "A business approach that creates long-term value by embracing opportunities and managing risks derived from economic, environmental, and social developments." },
        { term: "Sustainable Agriculture", definition: "Farming in sustainable ways based on an understanding of ecosystem services, and the study of relationships between organisms and their environment." },
        { term: "Sustainable Building", definition: "The practice of creating structures and using processes that are environmentally responsible and resource-efficient throughout a building's life-cycle." },
        { term: "Sustainable Consumption", definition: "The use of services and related products which respond to basic needs and bring a better quality of life while minimizing the use of natural resources and toxic materials." },
        { term: "Sustainable Design", definition: "The philosophy of designing physical objects, the built environment, and services to comply with the principles of social, economic, and ecological sustainability." },
        { term: "Sustainable Development", definition: "Development that meets the needs of the present without compromising the ability of future generations to meet their own needs." },
        { term: "Sustainable Development Goals (SDGs)", definition: "A set of 17 global goals adopted by the United Nations member states in 2015 to achieve a better and more sustainable future for all by 2030." },
        { term: "Sustainable Development Reporting", definition: "Reporting on how an organization contributes to sustainable development through its business practices." },
        { term: "Sustainable Finance", definition: "Financial services that integrate environmental, social, and governance criteria into business or investment decisions for the lasting benefit of both clients and society." },
        { term: "Sustainable Forestry", definition: "The practice of managing forest resources to meet the needs of the present without compromising the ability of future generations to meet their needs." },
        { term: "Sustainable Infrastructure", definition: "Infrastructure that is designed, built, operated, and decommissioned in a way that ensures its financial, social, and environmental sustainability." },
        { term: "Sustainable Investments", definition: "Investments made with consideration for environmental, social, and governance factors in addition to financial returns." },
        { term: "Sustainable Living", definition: "A lifestyle that attempts to reduce an individual's or society's use of the Earth's natural resources and personal resources." },
        { term: "Sustainable Packaging", definition: "Packaging that is better for the environment in terms of materials and process, reducing the ecological footprint." },
        { term: "Sustainable Practices", definition: "Actions and approaches that reduce negative impact on the environment and society, ensuring long-term ecological balance." },
        { term: "Sustainable Procurement", definition: "The process of purchasing goods and services that take into account the environmental, social, and economic impact of the item." },
        { term: "Sustainable Supply Chain", definition: "A supply chain that integrates environmental, social, and economic performance metrics into its operations." },
        { term: "Sustainable Tourism", definition: "Tourism that respects both local people and the traveler, cultural heritage and the environment." },
        { term: "Transparency", definition: "Openness, accountability, and clear communication of an organization's actions, decisions, and performance." },
        { term: "Triple Bottom Line", definition: "An accounting framework that considers three dimensions of performance: social, environmental, and financial, often used to assess CSR." },
        { term: "Waste Management", definition: "The activities and actions required to manage waste from its inception to its final disposal." },
        { term: "Waste Minimization", definition: "Processes and practices intended to reduce the amount of waste produced by a person or a society." },
        { term: "Water Conservation", definition: "The practice of using water efficiently to reduce unnecessary water usage." },
        { term: "Water Footprint", definition: "The total volume of freshwater that is used to produce goods and services consumed by an individual, community, or business." },
        { term: "Water Management", definition: "The activity of planning, developing, distributing, and managing the optimum use of water resources." },
      ];

  
  terms.sort((a, b) => a.term.localeCompare(b.term));

  // Filter terms based on search input
  const filteredTerms = useMemo(() => {
    return terms.filter(item =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [terms, searchTerm]);

  return (
    <div className="bg-blue-600 min-h-screen font-sans">
      <header className="text-white text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">ESG Glossary</h1>
        <p className="text-xl md:text-2xl mb-8">
          Key terms and definitions in Environmental, Social, and Governance (ESG)
        </p>
      </header>

      <main className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search terms..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredTerms.length === 0 ? (
            <p className="text-center text-gray-500">No matching terms found.</p>
          ) : (
            filteredTerms.map((item, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">{item.term}</h2>
                <p className="text-gray-700">{item.definition}</p>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center py-8">
        <p>&copy; 2024 Maxiumsys. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GlossaryPage;